from utils.hash_and_verify_password import hash_password
from mongodbmanager.models import MongoDBManager

class User:
    collection = MongoDBManager("users")
    
    @staticmethod
    def create(username, email, password, role="user", is_premium=False, bio=None, image_url=None):
        return User.collection.create({
            "username": username,
            "email": email,
            "password": hash_password(password),
            "role": role,
            "isPremium": is_premium,
            "bio": bio,
            "image_url": image_url,
            "follower": [], # List of the follower's ObjectId collection
            "albums": [] # List of the album's ObjectId collection
        })
            
    @staticmethod
    def get_by_email(email):
        return User.collection.find_one({'email': email})
        
    @staticmethod
    def get_by_role(role):
        return User.collection.find_one({'role': role})
        
    @staticmethod
    def get_by_username(username):
        return User.collection.find_one({'username': username})