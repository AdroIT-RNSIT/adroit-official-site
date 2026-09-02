import csv
from pymongo import MongoClient

def export_to_csv():
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["club-members"]
    collection = db["registrations"]

    # Fetch all records
    registrations = list(collection.find())
    
    if not registrations:
        print("No registrations found in the database.")
        return

    csv_file = "registrations_export.csv"
    
    # Gather all possible keys (fields) across all documents
    # because MongoDB documents can have varying schemas
    fieldnames = set()
    for reg in registrations:
        fieldnames.update(reg.keys())
    
    # Remove MongoDB's internal ID if present for cleaner export
    if "_id" in fieldnames:
        fieldnames.remove("_id")
        
    # Standardize order: Registration ID, Event, Team, College, etc.
    preferred_order = ["registrationId", "eventName", "teamName", "collegeName", "leaderEmail", "participants"]
    ordered_fields = [f for f in preferred_order if f in fieldnames]
    other_fields = sorted([f for f in fieldnames if f not in preferred_order])
    final_fieldnames = ordered_fields + other_fields

    try:
        with open(csv_file, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=final_fieldnames)
            writer.writeheader()
            
            for reg in registrations:
                # Remove internal _id before writing
                reg.pop("_id", None)
                
                # Format the participants array as a nice string instead of raw JSON
                if "participants" in reg and isinstance(reg["participants"], list):
                    parts = []
                    for p in reg["participants"]:
                        name = p.get("name", "Unknown")
                        usn = p.get("usn", "N/A")
                        parts.append(f"{name} ({usn})")
                    reg["participants"] = " | ".join(parts)
                
                writer.writerow(reg)
                
        print(f"✅ Successfully exported {len(registrations)} registrations to '{csv_file}'!")
    except Exception as e:
        print(f"❌ Error writing CSV file: {e}")

if __name__ == "__main__":
    export_to_csv()
