import keyring
import paho.mqtt.client as mqttc
import json
import datetime
from pymongo import MongoClient

broker_url = "node02.myqtthub.com"
broker_port = 1883
clean_session = True
topic = "/sensor/lectures"
client_id = "gente"
username = "gente1"
password = "gente2"


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print("Failed to connect, return code %d\n", rc)

def on_subscribe(client, userdata, mid, granted_qos):
    print("Subscribed: "+str(mid)+" "+str(granted_qos))


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))
    """ Callback called for every PUBLISH received """
    json_data = str(msg.payload.decode("utf-8"))

    intopic = str(msg.topic) #.decode("utf-8")
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
            LUX = parsed_data['LUX'] 
            
            str_Date = datetime.datetime.now().strftime('%Y/%m/%d')
            str_Time = datetime.datetime.now().strftime('%H/%M/%S')
            print('DATE - TIME : %s %s'   % (str_Date, str_Time))

            print('TMEP : %s' % T)
            print('AIRHUM: %d' % RH)
            print('SOIL: %d\n' % HUM)
            print('LUX: %d\n' % LUX)



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
            strLux = str(LUX)
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
                "LUX": strLux,
                "DATE_TIME": strDate,
            }
            result = collection.insert_one(new_document)

            # Retrieve and print all documents in the collection (optional)
            documents = collection.find()
            for document in documents:
                print(document)
            

    except Exception:
        print("JSON parsing ERROR... \n")

""" def on_log(client, userdata, level, string):
    print(string) """


client = mqttc.Client(client_id, clean_session)
client.username_pw_set(username, password)
client.on_message = on_message
client.on_connect = on_connect
client.on_subscribe = on_subscribe
""" client.on_log = on_log  """
client.connect(broker_url, broker_port, 15)
client.subscribe(topic, qos=1)

client.loop_forever()
