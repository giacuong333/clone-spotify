from mongodbmanager.models import MongoDBManager

class Genre:
    collection = MongoDBManager("genres")

    @staticmethod
    def create(name):
        return Genre.collection.create({
            "name": name
        })