const DatasetModel = require('../models/DatasetModel');

exports.processSearchQuery = async (query) => {
    // Implement your logic for searching datasets based on the query string
    const results = await DatasetModel.find({ $text: { $search: query } });
    
    return results.map(dataset => dataset._id); // Return an array of dataset IDs
};