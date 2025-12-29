
import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

# Load keys
load_dotenv(os.path.expanduser('~/Desktop/config.env'))
keys_str = os.getenv('GEMINI_API_KEYS', '')
if not keys_str:
    print("❌ No keys found in GEMINI_API_KEYS")
    exit()
    
keys = keys_str.split(',')

print(f"🔍 Testing {len(keys)} API Keys...\n")

for i, key in enumerate(keys):
    key = key.strip()
    if not key: continue
    
    masked = f"{key[:5]}...{key[-5:]}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}"
    data = json.dumps({"contents":[{"parts":[{"text":"Hi"}]}]}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"✅ Key {i+1}: {masked} - WORKING")
    except urllib.error.HTTPError as e:
        print(f"❌ Key {i+1}: {masked} - FAILED ({e.code})")
        print(f"   Reason: {e.reason}")
    except Exception as e:
        print(f"❌ Key {i+1}: {masked} - ERROR: {str(e)}")

print("\nDone.")
