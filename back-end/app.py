from openai import OpenAI
from dotenv import load_dotenv
import os

# Initialize the OpenAI client with your API key


load_dotenv()

# Step 2: Retrieve the API key from the environment variables
connection_url = os.getenv('OPENAI_API_KEY')

if connection_url is None:
    raise ValueError("API key not found in .env file")

# Initialize the OpenAI client with the API key
client = OpenAI(api_key=connection_url)

# Send a request to the ChatCompletion endpoint
response = client.chat.completions.create(
    model="gpt-3.5-turbo", 
    messages=[
        {
            "role": "user",
            "content": "I want to date a kawaii anime girl. Can you pretend to be a cute anime girl"
        },
        {
            "role": "system",
            "content": "Please use these keywords in your response: 'rizz', 'no cap', 'sus', 'sheeeeesh', 'among us', 'fanum tax' (taking other people's food). Make sure your reply sounds natural and playful while incorporating these terms."
        }
    ]
)

# Extract and print the assistant's reply

# Extract and print the assistant's reply
print(response.choices[0].message)


