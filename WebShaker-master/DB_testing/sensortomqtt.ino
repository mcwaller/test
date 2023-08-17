#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <time.h>

#define DHTTYPE DHT11 // DHT 11
#define BUTTON_PIN 21
int currentState;
// const char* ssid = "INFINITUM16AB";
// const char* password = "muGJXrPT3d";
const char *ssid = "UTT-CUERVOS";
const char *password = "CU3RV@S2022";
const char *mqtt_broker = "node02.myqtthub.com";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
char OutTopic[] = "/dispositivos";
char OutTopicA[] = "/dispositivos/alertas";
char InTopic[] = "/dispositivos/cntrl";
char onevalueTopic[] = "/dispositivos/send/onevalue";

float temperature = 0;
float humidity = 0;
#define PHOTO_PIN 32

uint8_t DHTPin = 13;
DHT dht(DHTPin, DHTTYPE);

long previousMillis = 1000;
long sampling_period = 10000;

void setup_wifi()
{
    delay(10);
    // Start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }
    Serial.println();
    Serial.print("Message received: ");
    if ((char)payload[0] == '1')
    {
        Serial.println("ON");
    }
    else if ((char)payload[0] == '0')
    {
        Serial.println("Off");
    }
}

void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        String clientId = "Node-Red-Backend";
        String MQTT_user = "userTest";
        String MQTT_pass = "pass002";
        // Attempt to connect
        if (client.connect(clientId.c_str(), MQTT_user.c_str(), MQTT_pass.c_str()))
        {
            Serial.println("connected");
            client.subscribe(InTopic);
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 2 seconds");
            delay(2000); // Wait 2 seconds before retrying
        }
    }
}

void get_sensor_values()
{
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    Serial.print(temperature, 1);
    Serial.print('\t');
    Serial.print(humidity, 0);
}

void setup()
{
    Serial.begin(115200);
    pinMode(DHTPin, INPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    dht.begin();
    setup_wifi();
    client.setServer(mqtt_broker, 1883);
    client.setCallback(callback);
    previousMillis = millis();
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();
    unsigned long now = millis();
    if (now - previousMillis > sampling_period)
    {

        // NODE SELECTION
        Serial.println("Enter data:");
        while (Serial.available() == 0)
        {
        }                                    // wait for data available
        String trimst = Serial.readString(); // read until timeout
        trimst.trim();

        int photoresistorValue = analogRead(PHOTO_PIN);
        get_sensor_values();

        time_t timestamp = time(nullptr);
        struct tm *timeinfo = localtime(&timestamp);

        // Modify the fields of timeinfo struct
        timeinfo->tm_year = 2023 - 1900; // Year (subtract 1900)
        timeinfo->tm_mon = 6 - 1;        // Month (0-11, subtract 1 for July)
        timeinfo->tm_mday = 10;          // Day
        timeinfo->tm_hour = 12;          // Hour
        timestamp = mktime(timeinfo);
        char timestampStr[20];
        sprintf(timestampStr, "%04d-%02d-%02d %02d:%02d:%02d", timeinfo->tm_year + 1900, timeinfo->tm_mon + 1, timeinfo->tm_mday, timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);

        String JSON_msg = "{\"n\":\"0319125113\",\"ToC\":" + String(temperature, 2);
        JSON_msg += ",\"RH\":" + String(humidity, 0) + ",\"LUX\":" + String(photoresistorValue) + ",\"DateTime\":\"" + String(timestampStr) + "\"}";

        Serial.print("Publish message: ");
        Serial.print(JSON_msg);
        // MQTT Publish to topic
        char JSON_msg_array[200];
        int JSON_msg_length = JSON_msg.length();
        JSON_msg.toCharArray(JSON_msg_array, JSON_msg_length + 1);
        Serial.println(JSON_msg_array);

        if (client.connected())
        {
            client.publish(OutTopic, JSON_msg_array);
            Serial.print("Published to topic: ");
            Serial.println(OutTopic);

            char chrToC[5];
            String strToC = String(temperature, 1);
            strToC.toCharArray(chrToC, 5);
            client.publish(onevalueTopic, chrToC);
            Serial.println(chrToC);
        }
        else
        {
            Serial.println("Not connected to broker... couldn't send MQTT message...");
        }

        // ALERTS
        currentState = digitalRead(BUTTON_PIN);
        if (currentState = LOW)
        {
            Serial.println("Button is pressed");
            String JSON_msg = "{\"n\":\"0319125113\",\"DateTime\":\"" + String(timestampStr) + "\"}";
            Serial.print("Publishing alert: ");
            Serial.print(JSON_msg);
            char JSON_msg_array[200];
            int JSON_msg_length = JSON_msg.length();
            JSON_msg.toCharArray(JSON_msg_array, JSON_msg_length + 1);
            if (client.connected())
            {
                // char OutTopic[] = "/dispositivos/alertas";
                client.publish(OutTopicA, JSON_msg_array);
                Serial.print("Published to topic: ");
                Serial.println(OutTopicA);

                char chrToC[5];
                String strToC = String(temperature, 1);
                strToC.toCharArray(chrToC, 5);
                client.publish(onevalueTopic, chrToC);
                Serial.println(chrToC);
            }
            else
            {
                Serial.println("Not connected to broker... couldn't send MQTT message...");
            }
        }
        currentState = HIGH;
        // String JSON_msg = "{\"n\":\"0319125113\",\"ToC\":" + String(temperature, 2);
        // JSON_msg += ",\"RH\":" + String(humidity, 0) + ",\"LUX\":" + String(photoresistorValue) + ",\"DateTime\":\""  + String(timestampStr) + "\"}";

        // Serial.print("Publishing alert... ");
        // Serial.print(JSON_msg);
        //// MQTT Publish to topic
        // char JSON_msg_array[200];
        // int JSON_msg_length = JSON_msg.length();
        // JSON_msg.toCharArray(JSON_msg_array, JSON_msg_length + 1);
        // Serial.println(JSON_msg_array);
        // if (client.connected()) {
        //   client.publish(OutTopic, JSON_msg_array);
        //   Serial.print("Published to topic: ");
        //   Serial.println(OutTopic);

        //  char chrToC[5];
        //  String strToC = String(temperature, 1);
        //  strToC.toCharArray(chrToC, 5);
        //  client.publish(onevalueTopic, chrToC);
        //  Serial.println(chrToC);
        //} else {
        //  Serial.println("Not connected to broker... couldn't send MQTT message...");
        //}

        previousMillis = millis();
    }
}
