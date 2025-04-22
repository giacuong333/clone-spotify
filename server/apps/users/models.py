from utils.hash_and_verify_password import hash_password
from mongodbmanager.models import MongoDBManager

class User:
    collection = MongoDBManager("users")
    
    @staticmethod
    def create(name, email, password, bio=None, image_url=None, role="user"):
        return User.collection.create({
            "name": name,
            "email": email,
            "password": hash_password(password),
            "bio": bio,
            "image_url": image_url,
            "role": role, # admin, user
        })
            
    @staticmethod
    def get_by_email(email):
        return User.collection.find_one({'email': email})
        
    @staticmethod
    def get_by_role(role):
        return User.collection.find_one({'role': role})