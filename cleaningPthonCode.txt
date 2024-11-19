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

def clean_keywords(keywords):
    if not keywords or keywords == '':
        return "NOT AVAILABLE"
    
    # Convert to lowercase
    keywords = keywords.lower()
    
    # Remove special characters and split
    words = re.findall(r'\b\w+\b', keywords)
    
    # Remove stopwords
    cleaned_words = [word for word in words if word not in english_stopwords]
    
    # Remove duplicates while preserving order
    unique_words = []
    for word in cleaned_words:
        if word not in unique_words:
            unique_words.append(word)
    
    return unique_words

def clean_creators(creators):
    if not creators or creators == '':
        return "NOT AVAILABLE"
    
    # Remove line breaks and extra whitespaces
    cleaned_creators = re.sub(r'\s+', ' ', creators.replace('\n', ', ')).strip()
    
    return cleaned_creators

def clean_dataset():
    # Iterate through all documents
    for doc in collection.find():
        update_operations = {}

        # Name check - delete if missing
        if 'Name' not in doc or not doc['Name']:
            collection.delete_one({'_id': doc['_id']})
            continue

        # UCIrepoId check - delete if missing
        if 'UCIrepoId' not in doc or not doc['UCIrepoId']:
            collection.delete_one({'_id': doc['_id']})
            continue

        # DOI Update
        update_operations['DOI'] = f"archive.ics.uci.edu/dataset/{doc['UCIrepoId']}"

        # Keywords Cleaning
        if 'Keywords' in doc:
            update_operations['Keywords'] = clean_keywords(doc['Keywords'])
        else:
            update_operations['Keywords'] = "NOT AVAILABLE"

        # Creators Cleaning
        if 'Creators' in doc:
            update_operations['Creators'] = clean_creators(doc['Creators'])
        else:
            update_operations['Creators'] = "NOT AVAILABLE"

        # Fields to replace with "NOT AVAILABLE" if missing
        fields_to_replace = [
            'AssociatedTasks', 'FeatureType', 'VariablesTable', 
            'Views', 'HasMissingValues', 'License', 
            'AdditionalVariableInfo', 'AbstractInfo', 'Instances', 
            'DatasetCharacteristics', 'SubjectArea', 
            'IntroductoryPapers', 'DatasetFiles', 'Features', 
            'DonatedDate', 'Citations', 'DatasetInformation'
        ]

        for field in fields_to_replace:
            if field not in doc or not doc[field]:
                update_operations[field] = "NOT AVAILABLE"

        # Timestamp handling
        if 'Timestamp' in doc:
            if not isinstance(doc['Timestamp'], str):
                update_operations['Timestamp'] = str(doc['Timestamp'])

        # License handling
        if 'License' in doc and doc['License']:
            update_operations['License'] = doc['License'].strip()

        # Perform bulk update
        if update_operations:
            collection.update_one(
                {'_id': doc['_id']},
                {'$set': update_operations}
            )

    # Print total documents after cleaning
    print(f"Total documents after cleaning: {collection.count_documents({})}")

# Run the cleaning process
clean_dataset()