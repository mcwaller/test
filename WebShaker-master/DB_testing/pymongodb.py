import pymongo
from pymongo import MongoClient
import datetime
######MongoDB
""" user = "Luis"
pwd = "0123456789"
db = "greencastle"
uri = "mongodb+srv://Luis:0123456789@clus.yi5exca.mongodb.net/greencastle?retryWrites=true&w=majority"
cluster = MongoClient(uri)
db = cluster["greencastle"]
collection = db["lectures"]

documents = collection.find()

for document in documents:
    print(document) """





current_datetime = datetime.datetime.now()
# Format the datetime to display only the time in hh:mm format
time_only = current_datetime.strftime('%H:%M')

strHum = "30"
strTemp = "50"
strSHum = "75"
strDate = time_only

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