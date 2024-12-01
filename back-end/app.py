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
def openai_call(character_list, background_list, game_info):
    print("yuck")
    print(character_list, background_list, game_info)
    try:
        # Call OpenAI API to generate the response
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Use the desired GPT model
                messages=[
        {"role": "system", "content": "You are an AI that generates JSON objects for a visual novel game based on the following data. Please do not generate anything other than the JSON files themself. No additional text."},
        {
            "role": "user",
            "content": """The 'GameStatus' JSON should follow this format:
    {{
      "gameID": "int(range(1,10))",
      "status": "In Progress",
      "screenID": 5
    }}

    The game is structured into three key JSON arrays: games, choices, and sprites. Each has specific rules and relationships, as detailed below.

    Key Rules and Guidelines:
    Game Status Initialization:

    The first screenId (screenId = 1) must always begin with a dialogue option in the textboxInfo field.
    Game JSON (games):

    Each object in games represents a screen in the game.
    textboxInfo includes:
    character: The name of the character speaking.
    dialogue: The dialogue text shown to the player.
    sprite: The ID of the textboxSprite that corresponds to the speaking character's visual representation.
    backgroundInfo includes:
    background: The ID of the sprite with spriteType set to backgroundImage.
    regularSprite includes:
    A list of sprite IDs where spriteType is regularSprite.
    nextType determines the type of transition:
    "screenId": Direct transition to another screen.
    "choiceId": Transition to a list of choices.
    nextScreen contains the ID(s) to transition to (either screenId or choiceId).
    Choices JSON (choices):

    Each object in choices represents a choice the player can make.
    Includes:
    choiceId: Unique ID for the choice.
    choiceText: Text displayed for the choice.
    nextScreen: The screenId that this choice leads to. Choices should only lead to screens with nextType set to "choiceId".
    Sprites JSON (sprites):

    Each object in sprites defines visual elements in the game.
    Includes:
    spriteId: Unique ID for the sprite.
    spriteType: Type of sprite (textboxSprite, backgroundImage, regularSprite).
    url: The URL of the sprite image.
    position: For textboxSprite or regularSprite, specifies xPos and yPos. backgroundImage has position set to null.
    Input Example:
    Here is an extended structure of the game JSON data:
    
    {
  "game": [
    {
      "screenId": 1,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "Hi there! Welcome to the most exciting adventure of your life. Ready to dive in?",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": [3],
      "nextType": "screenId",
      "nextScreen": 2
    },
    {
      "screenId": 2,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "You look amazing today! Let me show you something special.",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": [3],
      "nextType": "screenId",
      "nextScreen": 3
    },
    {
      "screenId": 3,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "I was wondering… Are you ready to explore what’s in my world?",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": null,
      "nextType": "choiceId",
      "nextScreen": [1, 2]
    },
    {
      "screenId": 4,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "Are you a magician? Because every time I look at you, everyone else disappears.",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": null,
      "nextType": "choiceId",
      "nextScreen": [3, 4]
    },
    {
      "screenId": 5,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "Congrats! You just unlocked the key to my heart.",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": [3],
      "nextType": "screenId",
      "nextScreen": 6
    },
    {
      "screenId": 6,
      "textboxInfo": {
        "character": "Angela",
        "dialogue": "The game is over. But you know what’s not over? My love for you.",
        "sprite": 1
      },
      "background": 2,
      "regularSprite": [3],
      "nextType": "screenId",
      "nextScreen": 7
    },
    {
      "screenId": 7,
      "textboxInfo": {
        "character": null,
        "dialogue": null,
        "sprite": null
      },
      "background": 4,
      "regularSprite": null,
      "nextType": null,
      "nextScreen": null
    }
  ],
  "choices": [
    { "choiceId": 1, "choiceText": "Explore your heart", "nextScreen": 5 },
    { "choiceId": 2, "choiceText": "Stay lost in your eyes", "nextScreen": 6 },
    { "choiceId": 3, "choiceText": "Let’s see the magic", "nextScreen": 5 },
    { "choiceId": 4, "choiceText": "Disappearing sounds fun!", "nextScreen": 6 },
    { "choiceId": 5, "choiceText": "Tell me more about you", "nextScreen": 3 },
    { "choiceId": 6, "choiceText": "Are you always this smooth?", "nextScreen": 4 }
  ],
  "sprites": [
    {
      "spriteId": 1,
      "spriteType": "textboxSprite",
      "url": "/characters/testTextboxSprite1.png",
      "position": { "xPos": 50, "yPos": 0 }
    },
    {
      "spriteId": 2,
      "spriteType": "backgroundImage",
      "url": "/backgrounds/test1.jpg",
      "position": null
    },
    {
      "spriteId": 3,
      "spriteType": "regularSprite",
      "url": ["/characters/testRegularSprite1.png"],
      "positions": [
        { "xPos": 500, "yPos": 100 }
      ]
    },
    {
      "spriteId": 4,
      "spriteType": "backgroundImage",
      "url": ["/backgrounds/test2.jpg"],
      "positions": null
    }
  ]
}




    Given the following input data, generate a 'GameStatus' and 'Game' JSON:
    Character List: {json.dumps(character_list, indent=2, default=str)}
    Background List: {json.dumps(background_list, indent=2, default=str)}
    Game Info: {json.dumps(game_info, indent=2, default=str)}

    Please provide two JSON objects as output: 'GameStatus' and 'Game' that can be passed to json.loads"""
        }
    ]
     
        )
        # print(response)
        # Extract the content from the API response
        ai_response = response.choices[0].message.content
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
        game_status_json, game_json = openai_call(character_list, background_list, game_info)

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
