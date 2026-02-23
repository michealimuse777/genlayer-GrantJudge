import requests
import json

url = "https://genlayer-faucet.vercel.app/api/faucet"
payload = {"address": "0x3e80a671da4d86401deea23c5142a34e93c30286999a397b64e6cf2d5b291d80"}
headers = {"Content-Type": "application/json"}

print(f"Requesting funds for {payload['address']}...")
try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
