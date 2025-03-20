from mongodbmanager.models import MongoDBManager
from bson import ObjectId
from datetime import datetime

class Report:
    collection = MongoDBManager("reports")

    @staticmethod
    def create(user_id, song_id, reason, description, status="pending", reviewed_by=None):
        return Report.collection.create({
            "user": ObjectId(user_id),
            "song": ObjectId(song_id),
            "reason": reason,
            "description": description,
            "status": status,
            "reviewed_by": ObjectId(reviewed_by) if reviewed_by else None
        })