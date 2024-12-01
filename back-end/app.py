from pymongo import MongoClient
from dotenv import main
import os
from flask import Flask, request, jsonify, send_file
import json
from dotenv import load_dotenv
import openai
import re

import base64
import urllib.request
import time
from datetime import datetime
from flask_cors import CORS




character_list = []
background_list = []
game_info = {}
# Load environment variables
load_dotenv()

# Initialize OpenAI API
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
game_collection = db["Games"]
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
        # print(ai_response)
        # Find the positions of the first and last curly braces
        start_idx = ai_response.find("{")
        end_idx = ai_response.rfind("}")

        # Extract the JSON string between the first and last curly braces
        json_string = ai_response[start_idx:end_idx + 1]

    
        ai_json = json.loads(json_string)
        
        print(ai_json)
        # game_status_json = ai_json.get("GameStatus")
        game_status_json = {}
        game_json = ai_json

        # Return the generated JSON objects
        return game_status_json, game_json

    except Exception as e:
        print(f"Error during API call: {e}")
        return {"error": str(e)}, {"error": str(e)}
    


def timestamp():
    return datetime.fromtimestamp(time.time()).strftime("%Y%m%d-%H%M%S")


def encode_file_to_base64(path):
    with open(path, 'rb') as file:
        return base64.b64encode(file.read()).decode('utf-8')


def decode_and_save_base64(base64_str, save_path):
    with open(save_path, "wb") as file:
        file.write(base64.b64decode(base64_str))


def call_api(api_endpoint, webui_server_url, **payload):
    data = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        f'{webui_server_url}/{api_endpoint}',
        headers={'Content-Type': 'application/json'},
        data=data,
    )
    response = urllib.request.urlopen(request)
    return json.loads(response.read().decode('utf-8'))


def call_txt2img_api(webui_server_url, out_dir_t2i, **payload):
    response = call_api('sdapi/v1/txt2img', webui_server_url, **payload)
    save_paths = []
    for index, image in enumerate(response.get('images')):
        save_path = os.path.join(out_dir_t2i, f'txt2img-{timestamp()}-{index}.png')
        save_paths.append(save_path)
        decode_and_save_base64(image, save_path)
    return save_path


def make_image_from_prompt(prompt):
    webui_server_url = os.getenv('SD_URL')
    out_dir = 'final_images'
    out_dir_i2i = out_dir
    os.makedirs(out_dir_i2i, exist_ok=True)
    batch_size = 1
    
    brainrot = "(skibidi:0.1), (gyatt:0.1), (rizz:0.1)"

    payload = {
            "prompt": "anime, masterpiece, landscape, background," + brainrot + "," + prompt,  # extra networks also in prompts
            "negative_prompt": "lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
            "steps": 10,
            "width": 820,
            "height": 512,
            "cfg_scale": 5,
            "sampler_name": "DPM++ 2M",
            "n_iter": 1,
            "batch_size": 1,
    }


    save_paths = call_txt2img_api(webui_server_url, out_dir_i2i, **payload)
    return (save_paths)


@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        # Get the prompt from the request JSON
        data = request.get_json()
        prompt = data.get('prompt', None)

        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        # Generate the image using the given prompt
        image_path = make_image_from_prompt(prompt)
        print('./' + image_path)

        # if not image_path:
        #     return jsonify({'error': 'Image generation failed'}), 500

        # Send the generated image back to the client
        return send_file('./' + image_path, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500



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
    background_list.append(jsonRequest)
    result = backgrounds_collection.insert_one(jsonRequest)
    return jsonify({"inserted_id": str(result.inserted_id)})

#adding game entry
@app.route('/create-game', methods=['GET'])
def add_game_entry(): 
    jsonRequest = request.get_json()
    game_info = jsonRequest
    result = game_info_collection.insert_one(jsonRequest)
    return jsonify({"inserted_id": str(result.inserted_id)})


# API endpoint to generate the game status and game JSONs
@app.route('/generate-game-json-from-scratch', methods=['POST'])
def generate_image_from_scratch():
    try:
        # Get the prompt from the request JSON
        data = request.get_json()
        game_info = data["game_info"]
        background_list = data["backgrounds"]
        character_list = data["characters"]

        game_status_json, game_json = openai_call(character_list, background_list, game_info)
    
        return game_json

    except Exception as e:
        return jsonify({"error": str(e)}), 500




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
