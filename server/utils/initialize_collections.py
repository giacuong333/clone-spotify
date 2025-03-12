from utils.connect_db import connect_db

def seed_collections():
    with connect_db() as database:
        existing_collections = database.list_collection_names()
        
        collections = [
            'users', 'songs', 'albums', 
            'artists', 'favorites', 'histories', 
            'playlists', 'reports',
        ]
        
        for collection in collections:
            if collection not in existing_collections:
                database.create_collection(collection)
    