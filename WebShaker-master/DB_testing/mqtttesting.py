
import paho.mqtt.client as mqtt
import time
import json
import pymongo 
from pymongo import MongoClient
import datetime
import ssl

""" mqtt config """
host          = "node02.myqtthub.com"
port          = 1883
clean_session = True
client_id     = "Aparatejo1"
user_name     = "KevinJairCastillo"
password      = "696969"
""" """ """ """ """ """ """ """

def on_connect (client, userdata, flags, rc):
    """ Callback called when connection/reconnection is detected """
    print ("Connect %s result is: %s" % (host, rc))

    # With Paho, always subscribe at on_connect (if you want to
    # subscribe) to ensure you resubscribe if connection is
    # lost.
    # client.subscribe("some/topic")

    if rc == 0:
        client.connected_flag = True
        print ("connected OK")
        return
    
    print ("Failed to connect to %s, error was, rc=%s" % rc)
    # handle error here
    sys.exit (-1)


def on_message(client, userdata, msg):

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
            
            str_Date = datetime.datetime.now().strftime('%Y/%m/%d')
            str_Time = datetime.datetime.now().strftime('%H/%M/%S')
            print('DATE - TIME : %s %s'   % (str_Date, str_Time))

            print('TMEP : %s' % T)
            print('AIRHUM: %d' % RH)
            print('SOIL: %d\n' % HUM)
            

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
# Define clientId, host, user and password
client = mqtt.Client (client_id = client_id, clean_session = clean_session)
client.username_pw_set (user_name, password)

client.on_connect = on_connect
client.on_message = on_message

# configure TLS connection
# client.tls_set (cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2)
# client.tls_insecure_set (False)
# port = 8883

# connect using standard unsecure MQTT with keepalive to 60
client.connect (host, port, keepalive = 60)
client.connected_flag = False
while not client.connected_flag:           #wait in loop
    client.loop()
    time.sleep (10)