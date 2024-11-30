from pymongo import MongoClient
from dotenv import main
import os

'''
MongoDB to store the user input
'''


#Establishing connection 
main.load_dotenv()
connection_url = "mongodb+srv://achiang2048:IzOuep2PfaLIE7K5@pyonpyonstudio.ydpew.mongodb.net/?retryWrites=true&w=majority&appName=PyonPyonStudio" #gets key value from .env file 

# Connect to MongoDB
client = MongoClient(connection_url)
print(client)


db_name = "PyonPyon" 
db = client[db_name]
# print(db)

# Collections: 
backgrounds_collection = db["Backgrounds"]
character_collection = db["Characters"]
game_collection = db["Games"]
game_info_collection = db["VNInformation"]
game_status_collection = db["GameStatuses"]

# Print all documents in the 'Backgrounds' collection
print("Backgrounds Collection:")
for document in backgrounds_collection.find():
    print(document)

# Test the connection
try:
    # List all databases to ensure the connection works
    print("Databases:", client.list_database_names())
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Error connecting to MongoDB:", e)

# Optional: Close the connection after operations
client.close()

'''
To do: 
query each table
    game 

add to each table: 
    character
    background
    game
    game_info 
    game_status
'''

if __name__ == '__main__': 
    app.run(debug = True)
