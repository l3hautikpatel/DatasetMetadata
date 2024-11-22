from pymongo import MongoClient

# Connect to your MongoDB instance
client = MongoClient('mongodb+srv://bhautik:bhautik@cluster0.2wics.mongodb.net/')
db = client['UCIMeta']
collection = db['Meta01']

def update_searching_words():
    # Find all documents in the collection
    documents = collection.find()

    for doc in documents:
        name = doc.get('Name', '')
        searching_words = doc.get('SearchingWords', '')
        
        # Split searching words into a list and strip any whitespace
        searching_words_list = [word.strip() for word in searching_words.split(',') if word.strip()]
        
        # Prepare the new words to be added
        name_words = [word.strip() for word in name.split()]
        
        # Check if the full name is in searching words
        if name not in searching_words_list:
            searching_words_list.append(name)
        
        # Check for individual words in the name
        for word in name_words:
            if word not in searching_words_list:
                searching_words_list.append(word)
        
        # Join the updated searching words list back into a string
        updated_searching_words = ', '.join(searching_words_list)
        
        # Update the document in the database
        collection.update_one({'_id': doc['_id']}, {'$set': {'SearchingWords': updated_searching_words}})

if __name__ == "__main__":
    update_searching_words()