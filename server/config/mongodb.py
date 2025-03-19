from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017/") 
    database = client["clone_spotify"] 
    print("Database connected successfully")
except:
    print("Database connected failed!")