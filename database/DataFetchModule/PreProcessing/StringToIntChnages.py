from pymongo import MongoClient
import datetime
import re

# Connect to MongoDB
client = MongoClient('mongodb+srv://bhautik:bhautik@cluster0.2wics.mongodb.net/')
db = client['UCIMeta']
collection = db['Meta01']
# Initialize counters
updated_count = 0

# Define a function to convert citation and view strings to integers
def convert_citations_views(value):
    if value == "NOT AVAILABLE":
        return value
    match = re.search(r'(\d+)', value)
    return int(match.group(1)) if match else value

# Update documents in the collection
for document in collection.find():
    updates = {}
    
    # Update Citations
    if 'Citations' in document:
        citations = convert_citations_views(document['Citations'])
        updates['Citations'] = citations
    
    # Update Views
    if 'Views' in document:
        views = convert_citations_views(document['Views'])
        updates['Views'] = views
    
    # Update DonatedDate
    if 'DonatedDate' in document:
        if document['DonatedDate'] != "NOT AVAILABLE":
            try:
                # Convert string date to datetime object
                donated_date = datetime.datetime.strptime(document['DonatedDate'], "%m/%d/%Y")
                updates['DonatedDate'] = donated_date
            except ValueError:
                pass  # Keep the original value if there's a parsing error
    
    # If there are updates, apply them
    if updates:
        collection.update_one({'_id': document['_id']}, {'$set': updates})
        updated_count += 1

# Print the number of affected rows
print(f'Number of affected rows: {updated_count}')