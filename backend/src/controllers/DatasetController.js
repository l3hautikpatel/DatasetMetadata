const DatasetModel = require('../models/DatasetModel');
const { processSearchQuery } = require('../utils/searchUtils');

exports.searchDatasets = async (req, res) => {
    const { query } = req.query; // Get the search string from the request
    try {
        // Process the search query to get relevant IDs
        const ids = await processSearchQuery(query);
        res.status(200).json(ids);
    } catch (error) {
        res.status(500).json({ message: 'Error searching datasets', error });
    }
};

exports.getDataById = async (req, res) => {
    const { id } = req.params; // Get the dataset ID from the request parameters
    try {
        const dataset = await DatasetModel.findById(id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        res.status(200).json(dataset);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving dataset', error });
    }
};