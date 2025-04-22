from apps.users.models import User
from apps.songs.models import Song
from apps.playlists.models import Playlist
from apps.listenedAt.models import ListenedAt
from apps.genre.models import Genre
from apps.downloadedAt.models import DownloadedAt

class SampleData:
    
    @staticmethod
    def had_data():
        if User.collection.filter({}).count() == 0:
            return False
        if Song.collection.filter({}).count() == 0:
            return False
        if Playlist.collection.filter({}).count() == 0:
            return False
        if ListenedAt.collection.filter({}).count() == 0:
            return False
        if Genre.collection.filter({}).count() == 0:
            return False
        if DownloadedAt.collection.filter({}).count() == 0:
            return False
        return True
        
    
    @staticmethod
    def seed_data():
        if not SampleData.had_data():
            # Users (10)
            users = [
                User.create(f"User{i}", f"user{i}@example.com", f"pass{i}", f"Bio {i}", f"img{i}.jpg", "user" if i % 2 == 0 else "admin")
                for i in range(1, 11)
            ]

            # Genres (10)
            genres = [
                Genre.create(name)
                for name in ["Pop", "Rock", "Jazz", "HipHop", "Classical", "Electronic", "Country", "R&B", "Reggae", "Blues"]
            ]

            # Songs (10, file_url = None)
            songs = [
                Song.create(
                    f"Song {i}", genres[i-1], None, f"cover{i}.jpg",
                    f"2023-{i:02d}-01T00:00:00Z", f"2023-{i:02d}-02T00:00:00Z", None,
                    users[i-1], 180 + i
                )
                for i in range(1, 11)
            ]

            # Playlists (10)
            playlists = [
                Playlist.create(
                    f"Playlist {i}", f"cover{i}.jpg", i % 2 == 0, f"Desc {i}",
                    users[i-1], [songs[i-1], songs[9-i]]
                )
                for i in range(1, 11)
            ]

            # ListenedAt (10)
            listened = [
                ListenedAt.create(users[i-1], songs[i-1])
                for i in range(1, 11)
            ]

            # DownloadedAt (10)
            downloaded = [
                DownloadedAt.create(users[i-1], songs[i-1])
                for i in range(1, 11)
            ]
            
            print("Seed data successfully")