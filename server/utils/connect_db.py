from contextlib import contextmanager
from config.mongodb import database, client

@contextmanager
def connect_db():
    try: 
        yield database
    finally:
        client.close()