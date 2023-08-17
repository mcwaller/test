import paho.mqtt.client as mqttClient
import json
import pymysql
import pymongo 
from pymongo import MongoClient
import time
import datetime

topic1 = "/UTT/node0319125113"

def on_connect(client,userdata,flags,rc):
    print("Connected code: "+str(rc))
    client.subscribe(topic1)

def on_message(client,userdata,message):
    json_data = str(message.payload.decode("utf-8"))

    intopic = str(message.topic) #.decode("utf-8")
    print("Topic: %s , message: %s" % (intopic, json_data))
    try:
        if json_data != '':
            print("Recibido: %s" % json_data)
            parsed_data = json.loads(json_data)

            """ node = parsed_data['n']
            temperature = parsed_data['ToC']
            RH = parsed_data['RH']
            LUX = parsed_data['LUX'] """

            T = parsed_data['T']
            RH = parsed_data['RH']
            HUM = parsed_data['HUM'] 
            
            str_Date = datetime.datetime.now().strftime('%Y/%m/%d')
            str_Time = datetime.datetime.now().strftime('%H/%M/%S')
            print('DATE - TIME : %s %s'   % (str_Date, str_Time))

            """ print('Node : %s' % node)
            print('Temperature: %d' % temperature)
            print('Relative humidity: %d\n' % RH)
            print('Light levels: %d\n' % LUX) """


            """ strNode = str(node)
            strTemp = str(temperature)
            strHum = str(RH)
            strLux = str(LUX) """
            ##formato date
            current_datetime = datetime.datetime.now()
            time_only = current_datetime.strftime('%H:%M')

            strHum = str(RH)
            strTemp = str(T)
            strSHum = str(HUM)
            strDate = str(time_only)


            """ #####MySQL
            sql_user = "root"
            sql_password = ""
            sql_DB = "exam0319125113" #"arduinotest"

            try:
                db = pymysql.connect(host = "localhost", user=sql_user, \
                password = sql_password, database = sql_DB)
            except:
                print("MySQL connection failed!")
            cursor = db.cursor()
            SQL_table = "node_" + strNode
            SQL_string = "INSERT INTO %s (T,RH,LUX) VALUES ('%s','%s','%s')" % (SQL_table,strTemp,strHum,strLux)
            print(SQL_string)
            try:
                cursor.execute(SQL_string)
                db.commit()
                print("Node %s: DB storage success!!\n" % strNode)
            except:
                print("MySQL Error... ")
            """

            ######MongoDB
            uri = "mongodb+srv://Luis:0123456789@clus.yi5exca.mongodb.net/greencastle?retryWrites=true&w=majority"
            cluster = MongoClient(uri)
            db = cluster["greencastle"]
            collection = db["lectures"]

            new_document = {
                "RH": strHum,
                "T": strTemp,
                "HUM": strSHum,
                "DATE_TIME": strDate,
            }
            result = collection.insert_one(new_document)

            # Retrieve and print all documents in the collection (optional)
            documents = collection.find()
            for document in documents:
                print(document)
            

    except Exception:
        print("JSON parsing ERROR... \n")
client = mqttClient.Client()
""" broker = "broker.hivemq.com"
port = 1883 """

""" python to mqtt """
broker          = "node02.myqtthub.com"
port          = 1883
clean_session = True
client_id     = "<device-client-id>"
user_name     = "<device-user-name>"
password      = "<device-password>"



sql_user = "userTest"
sql_password = "userTestpass"
sql_DB = "iotdb_0319125113"

try:
    client.connect(broker,port,60) #("test.mosquitto.org",1883,60)
except Exception:
    print("Error MQTT connect ")

print("MQTT Subscriber started...")
client.on_connect = on_connect
client.on_message = on_message
client.loop_forever()