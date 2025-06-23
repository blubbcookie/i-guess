print("heating up da systems bruv")
import requests
import os
from dotenv import load_dotenv



load_dotenv(dotenv_path="D:/i guess/riven/lol-tracker/.env")
API_KEY = os.getenv("RIOT_API_KEY")
if not API_KEY:
    print("apikey konnte nicht geladen werden! überprüfe .env-datei und pfad.")
    exit()
headers = {"X-Riot-Token": API_KEY}

summoner_name = "blubb"
region = "euw1"

url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}"

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    print(f"name: {data['name']}")
    print(f"level: {data['summonerLevel']}")
else:
    print(f"fehler beim abrufen: {response.status_code} - {response.text}")

print(f"apikey geladen: {API_KEY}")
print(str(os.listdir()))
print(open("D:\\i guess\\riven\\lol-tracker\\.env"))

