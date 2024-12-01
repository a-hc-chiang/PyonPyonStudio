from pymongo import MongoClient
from dotenv import main
import os
from flask import Flask, request, jsonify
import json
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
main.load_dotenv()
connection_url = os.getenv('URL')  # MongoDB connection URL from .env file
client = MongoClient(connection_url)
print(client)

db_name = "PyonPyon" 
db = client[db_name]

# Collections
backgrounds_collection = db["Backgrounds"]
character_collection = db["Characters"]
game_info_collection = db["VNInformation"]
game_status_collection = db["GameStatuses"]

# Test MongoDB connection
try:
    print("Databases:", client.list_database_names())
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Error connecting to MongoDB:", e)

# Helper function to fetch data from MongoDB collections
def fetch_data_from_db():
    character_list = list(character_collection.find())
    background_list = list(backgrounds_collection.find())
    game_info = game_info_collection.find_one()  # Assuming there's only one game info document
    return character_list, background_list, game_info

def to_openAI_API(character_list, background_list, game_info):
    data = {
        "characterList": character_list, 
        "backgroundList": background_list, 
        "game": game_info
    }
    request = {0: "Thing", 1:"Other thing"} # Placeholder, will be modified for real OpenAI call
    result_0 = game_collection.insert_one(request[0])
    result_1 = game_status_collection.insert_one(request[1])
    return None 

# New function to interact with OpenAI and generate the JSONs
def openai(character_list, background_list, game_info):
    prompt = f"""
    You are an AI that generates JSON objects for a visual novel game based on the following data.

    The 'GameStatus' JSON should follow this format:
    {{
      "gameID": "ObjectId('gameId1')",
      "status": "In Progress",
      "screenID": 5
    }}

    The 'Game' JSON should follow this format:
    {{
      "screenID": 1,
      "textBoxInfo": {{
        "Character": "ObjectId('characterId1')",
        "dialogue": "Welcome to the Enchanted Forest!",
        "sprite": [1, 2, 3, 4, 5]
      }},
      "background": "ObjectId('backgroundId1')",
      "regularSprites": [1, 2, 3, 4],
      "nextType": "screenID",
      "nextScreen": 2,
      "choices": [
        {{
          "choiceID": 1,
          "choiceText": "Explore the forest",
          "nextScreen": 2
        }},
        {{
          "choiceID": 2,
          "choiceText": "Talk to the guide",
          "nextScreen": 3
        }}
      ],
      "Character": ["ObjectId('characterId1')", "ObjectId('characterId2')"],
      "Background": ["ObjectId('backgroundId1')"]
    }}

    Given the following input data, generate a 'GameStatus' and 'Game' JSON:
    Character List: {json.dumps(character_list, indent=2)}
    Background List: {json.dumps(background_list, indent=2)}
    Game Info: {json.dumps(game_info, indent=2)}

    Please provide two JSON objects as output: 'GameStatus' and 'Game'.
    """
    print("hello")
    try:
        # Call OpenAI API to generate the response
        response = openai.Completion.create(
            model="gpt-3.5-turbo",  # Use the desired GPT model
            prompt=prompt,
            max_tokens=500,
            temperature=0.7,
        )
        print(response)
        # Extract the content from the API response
        ai_response = response.choices[0].message['content']
        print(ai_response)
        
        # Parse the AI-generated JSON
        ai_json = json.loads(ai_response)
        game_status_json = ai_json.get("GameStatus")
        game_json = ai_json.get("Game")

        # Return the generated JSON objects
        return game_status_json, game_json

    except Exception as e:
        print(f"Error during API call: {e}")
        return {"error": str(e)}, {"error": str(e)}

# API endpoint to generate the game status and game JSONs
@app.route('/generate-game-json', methods=['GET'])
def generate_game_json():
    try:
        # Fetch data from MongoDB
        character_list, background_list, game_info = fetch_data_from_db()

        # Generate GameStatus and Game JSON from OpenAI
        game_status_json, game_json = openai(character_list, background_list, game_info)

        # Check if both JSONs were generated successfully
        if "error" in game_status_json or "error" in game_json:
            return jsonify({"error": "Failed to generate JSONs"}), 500

        # Insert the generated JSON into MongoDB
        game_status_collection.insert_one(game_status_json)
        game_collection.insert_one(game_json)

        return jsonify({
            "game_status": game_status_json,
            "game": game_json
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
    print("hi")
