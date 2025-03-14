from utils.initialize_collections import connect_db
from utils.hash_and_verify_password import hash_password
from bson import ObjectId

class User:
    def __init__(self,
                _id,
                username,
                email,
                password,
                playlist=None,
                favorite=None,
                history=None,
                isPremium=False):
        self._id = _id       
        self.username = username       
        self.email = email       
        self.password = password       
        self.playlist = playlist if playlist else []       
        self.favorite = favorite if favorite else []    
        self.history = history if history else []       
        self.isPremium = isPremium       
        
    def create(self):
        with connect_db() as database:
            user_data = {
                'username': self.username,
                'email': self.email,
                'password': hash_password(self.password),
                'playlist': self.playlist,
                'favorite': self.favorite,
                'history': self.history,
                'isPremium': self.isPremium
            }
            result = database['users'].insert_one(user_data)
            return str(result.inserted_id)
    
    @staticmethod
    def update(user_id, update_data):
        with connect_db() as database:
            return database['users'].update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
    
    @staticmethod
    def delete(user_id):
        with connect_db() as database:
            return database['users'].delete_one(
                {'_id': ObjectId(user_id)},
            )
    
    @staticmethod
    def get_all():
        with connect_db() as database:
            return list(database['users'].find())
    
    @staticmethod
    def get_by_id(user_id):
        with connect_db() as database:
            return database['users'].find_one({
                '_id': ObjectId(user_id)
            })
            
    @staticmethod
    def get_by_email(email):
        with connect_db() as database:
            return database['users'].find_one({'email': email})
        
        
    @staticmethod
    def get_by_username(username):
        with connect_db() as database:
            return database['users'].find_one({'username': username})
        
    # @classmethod
    # def from_mongo(cls, mongo_data):
    #     return cls(
    #         _id=str(mongo_data['_id']),
    #         email=mongo_data['email'],
    #         password=mongo_data['password'],
    #         username=mongo_data.get('username'),
    #         playlist=mongo_data.get('playlist', []),
    #         favorite=mongo_data.get('favorite', []),
    #         history=mongo_data.get('history', []),
    #         isPremium=mongo_data.get('isPremium', False)
    #     )