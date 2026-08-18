from pymongo import MongoClient
import json
from bson import json_util

# Connect to the local MongoDB database
client = MongoClient("mongodb://localhost:27017/club-members")
db = client.get_database()
registrations_collection = db.registrations

print("==== EVENT REGISTRATIONS ====\n")

# Fetch all registrations
registrations = list(registrations_collection.find())

if not registrations:
    print("No registrations found yet.")
else:
    for index, reg in enumerate(registrations, 1):
        print(f"--- Registration {index} ---")
        # Format and print the document nicely (handling ObjectId safely)
        print(json.dumps(reg, default=json_util.default, indent=2))
        print("\n")

print("=============================")
