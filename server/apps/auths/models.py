from utils.connect_db import connect_db

class Auth: 
    def __init__(self, email, password):
        self.email = email
        self.password = password
    
    @staticmethod
    def get_by_email(email):
        with connect_db() as database:
            return database['users'].find_one({'email': email})
        return None
                
