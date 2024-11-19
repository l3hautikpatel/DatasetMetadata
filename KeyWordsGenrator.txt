from pymongo import MongoClient
import re
import nltk
from nltk.corpus import stopwords

# Download stopwords
nltk.download('stopwords', quiet=True)
english_stopwords = set(stopwords.words('english'))

# MongoDB Connection
client = MongoClient('mongodb+srv://bhautik:bhautik@cluster0.2wics.mongodb.net/')
db = client['UCIMeta']
collection = db['Meta01']

def clean_searching_words(doc):
    # List to store valid search words
    search_words = []

    # Fields to concatenate
    fields_to_check = [
        'SubjectArea', 
        'Keywords', 
        'FeatureType', 
        'AssociatedTasks', 
        'DatasetCharacteristics'
    ]

    for field in fields_to_check:
        # Check if field exists and is not "NOT AVAILABLE"
        if field in doc and doc[field] and doc[field] != "NOT AVAILABLE":
            # Handle different types of input
            if isinstance(doc[field], list):
                # If it's a list, join with comma
                search_words.extend(doc[field])
            elif isinstance(doc[field], str):
                # If it's a string, split and clean
                words = re.findall(r'\b\w+\b', doc[field].lower())
                search_words.extend(words)

    # Remove duplicates while preserving order and remove stopwords
    unique_search_words = []
    for word in search_words:
        # Convert to lowercase and remove stopwords
        cleaned_word = word.lower()
        if cleaned_word not in english_stopwords and cleaned_word not in unique_search_words:
            unique_search_words.append(cleaned_word)

    # Join with comma
    return ", ".join(unique_search_words)

def clean_has_missing_values():
    # Count of modified documents
    modified_count = 0

    # Iterate through all documents
    for doc in collection.find():
        update_operations = {}

        # Check HasMissingValues field
        if 'HasMissingValues' in doc:
            # Convert to lowercase and trim
            cleaned_value = str(doc['HasMissingValues']).lower().strip()
            
            # Check against allowed values
            if cleaned_value in ['yes', 'no']:
                update_operations['HasMissingValues'] = cleaned_value
            else:
                update_operations['HasMissingValues'] = "NOT AVAILABLE"

        # Add SearchingWords
        update_operations['SearchingWords'] = clean_searching_words(doc)

        # Perform update if there are operations
        if update_operations:
            collection.update_one(
                {'_id': doc['_id']},
                {'$set': update_operations}
            )
            modified_count += 1

    # Print total modified documents
    print(f"Total documents modified: {modified_count}")
    print(f"Total documents in collection: {collection.count_documents({})}")

# Run the cleaning process
clean_has_missing_values()