from pymongo import MongoClient
from dotenv import main
import os
from flask import Flask, request, jsonify
import json
from dotenv import load_dotenv
#import my_openai_api

'''
MongoDB to store the user input
To do: 
query each table
    game 

add to each table: 
    game
    game_status
'''

character_list = []
background_list = []
game_info = {}

app = Flask(__name__)
load_dotenv()

#Establishing connection to MongoDB
main.load_dotenv()
connection_url = os.getenv('URL') #gets key value from .env file 
client = MongoClient(connection_url)
print(client)

db_name = "PyonPyon" 
db = client[db_name]

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

#adding character entry 
@app.route('/create-character', methods=['GET'])
def add_character(): 
    jsonRequest = request.json
    character_list.append(jsonRequest)
    result = character_collection.insert_one(jsonRequest)
    return jsonify({"inserted_id": str(result.inserted_id)})

#adding bg entry 
@app.route('/add-background', methods=['GET'])
def add_background(): 
    jsonRequest = request.json
    backgrounds_collection.append(jsonRequest)
    result = backgrounds_collection.insert_one(jsonRequest)
    return jsonify({"inserted_id": str(result.inserted_id)})

#adding game entry
@app.route('/create-game', methods=['GET'])
def add_game_entry(): 
    jsonRequest = request.get_json()
    game_info = jsonRequest
    result = game_info_collection.insert_one(jsonRequest)
    return jsonify({"inserted_id": str(result.inserted_id)})

#putting everything into JSON to the openAI API 
def to_openAI_API(): 
    data = {
        "characterList": character_collection, 
        "backgroundList": background_list, 
        "game": game_info
    }
    request = {0: "Thing", 1:"Other thing"} #change later, this is where you hit the openai api 
    result_0 = game_collection.insert_one(request[0])
    result_1 = game_status_collection.insert_one(resquest[1])
    return NULL 


if __name__ == '__main__': 
    app.run(debug = True)