const DatasetModel = require('../models/DatasetModel');

exports.processSearchQuery = async (query) => {
    try {
        // Use a regular expression to search for names that match the query
        const results = await DatasetModel.find(
            { Name: { $regex: query, $options: 'i' } }, // Case-insensitive search
            { UCIrepoId: 1 } // Only fetch the UCIrepoId field
        );
        
        return { ids: results.map(result => result.UCIrepoId) }; // Return the UCIRepoId values
    } catch (error) {
        console.error('Error processing search query:', error);
        throw error; // Rethrow the error for handling in the controller
    }
};
