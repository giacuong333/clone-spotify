from pymongo import MongoClient
from django.conf import settings
from bson import ObjectId
from datetime import datetime
from config.mongodb import database

class MongoDBManager: 
    
    def __init__(self, collection_name):
        self._db_collection = database[collection_name]
        
    def create(self, data):
        return self._db_collection.insert_one(data).inserted_id
    
    def get(self, _id):
        return self._db_collection.find_one({"_id": ObjectId(_id)})
    
    def find_one(self, query): 
        return self._db_collection.find_one(query)

    def filter(self, query):
        return self._db_collection.find(query)

    def update(self, _id, data):
        return self._db_collection.update_one(
            {"_id": ObjectId(_id)}, 
            {"$set": data}
        )

    def delete(self, _id):
        return self._db_collection.delete_one({"_id": ObjectId(_id)})
    
    def aggregate(self, pipline):
        return self._db_collection.aggregate(pipline)