#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <time.h>


#define DHTTYPE DHT11 // DHT 11
int currentState;
//const char* ssid = "INFINITUM16AB";
//const char* password = "muGJXrPT3d";
//const char* ssid = "UTT-CUERVOS";
//const char* password = "CU3RV@S2022";

//const char* ssid = "iPhone de Erick";
//const char* password = "12345678";
const char* ssid = "FallenWifi";
const char* password = "halo3.pkmn";
const char* mqtt_broker = "node02.myqtthub.com";

/* Sensor Calibration */
const int AirValue = 3040;   //you need to replace this value with Value_1
const int WaterValue = 0;  //you need to replace this value with Value_2
const int SensorPin = 34; //sensor pin
int soilMoistureValue = 0;
int soilmoisturepercent=0;

/* Relay */
const int RELAY_PIN = 33;


WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
char SensorTopic[] = "/sensor/lectures";
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

void setup_wifi() {
  delay(10);
  // Start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  } 
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  Serial.print("Message received: ");
  if ((char)payload[0] == '1') {
    Serial.println("ON");
  } else if ((char)payload[0] == '0') {
    Serial.println("Off");
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "Aparatejo1";
    String MQTT_user = "kevin";
    String MQTT_pass = "696969";
    // Attempt to connect
    if (client.connect(clientId.c_str(), MQTT_user.c_str(), MQTT_pass.c_str())) {
      Serial.println("connected");
      client.subscribe(InTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000); // Wait 2 seconds before retrying
    }
  }
}

void get_sensor_values() {
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  Serial.print(temperature, 1);
  Serial.print('\t');
  Serial.print(humidity, 0);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(DHTPin, INPUT);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_broker, 1883);
  client.setCallback(callback);
  previousMillis = millis();
}

void loop() {


 /* ///////////// */

  if (!client.connected()) {
    reconnect();
  }
  client.loop();


  /* //////////////////////////////////////////////////////////////////////// */

  /* //////////////////////////////////////////////////////////////////////// */
  unsigned long now = millis();
  if (now - previousMillis > sampling_period) {
    
    
    Serial.println(dht.readTemperature());
    int photoresistorValue = analogRead(PHOTO_PIN);
    photoresistorValue = photoresistorValue/10;
    get_sensor_values();

    /* Sensor reading */
    soilMoistureValue = analogRead(SensorPin);  //put Sensor insert into soil
    Serial.println(soilMoistureValue);//3620//1680//0//
    soilmoisturepercent = map(soilMoistureValue, AirValue, WaterValue, 0, 100);

    /* ///////////// */
    const int threshold = 34;
    if(soilmoisturepercent > threshold){
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Relay estado 1");
    }
    else{
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Relay estado 0");
    }
    /* ON/OFF */
/*     if(soilmoisturepercent<threshold){
      digitalWrite(relay, LOW);
      Serial.println("Current Flowing");
      Serial.println(soilmoisturepercent);
    }else{
      digitalWrite(relay, HIGH);
      Serial.println("Current not Flowing");
      Serial.println(soilmoisturepercent);
    } */
    
/*     String JSON_msg = "{\"T\":" + String(temperature, 2);
    JSON_msg += ",\"RH\":" + String(humidity, 0) + ",\"HUM\":" + String(soilmoisturepercent) + ",\"LUX\":" + String(photoresistorValue)+"\"}";
     */
    String JSON_msg = "{\"T\":" + String(temperature, 2);
    JSON_msg += ",\"RH\":" + String(humidity, 0) + ",\"HUM\":" + String(soilmoisturepercent) + ",\"LUX\":" + String(photoresistorValue) + "}";

    Serial.print("Publish message: ");
    Serial.print(JSON_msg);
    // MQTT Publish to topic
    char JSON_msg_array[200];
    int JSON_msg_length = JSON_msg.length();
    JSON_msg.toCharArray(JSON_msg_array, JSON_msg_length + 1);
    Serial.println(JSON_msg_array);

    if (client.connected()) {
      client.publish(SensorTopic, JSON_msg_array);
      Serial.print("Published to topic: ");
      Serial.println(SensorTopic);

      char chrToC[5];
      String strToC = String(temperature, 1);
      strToC.toCharArray(chrToC, 5);
      client.publish(onevalueTopic, chrToC);
      Serial.println(chrToC);
    } else {
      Serial.println("Not connected to broker... couldn't send MQTT message...");
    }

    
    previousMillis = millis();
  }
}
