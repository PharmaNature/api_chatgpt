import os 
import openai
from dotenv import load_dotenv
load_dotenv()

openai.organization = os.getenv("ORG_ID", default=None)
openai.api_key = os.getenv("KEY_API", default=None)

for k in range(3):
    messages=[{"role": "system", "content": "Tu es français"}]
    msg = input()
    if msg == "stop":
        break
    messages.append({"role": "user", "content": msg})
    reply = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages)
    messages.append({"role": "assistant", "content": reply['choices'][0]['message']['content']})
    print(reply['choices'][0]['message']['content'])
