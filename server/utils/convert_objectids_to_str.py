from bson import ObjectId

def convert_objectids_to_str(data):
    if isinstance(data, dict):
        return {key: convert_objectids_to_str(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectids_to_str(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    return data