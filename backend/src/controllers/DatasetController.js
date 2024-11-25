const DatasetModel = require('../models/DatasetModel');
const { processSearchQuery } = require('../utils/searchUtils');

exports.searchDatasets = async (req, res) => {
    

    
    try {
        // Process the search query to get relevant UCIRepoIds
        const ids = await processSearchQuery(req);
        // console.log(ids);

        res.status(200).json(ids);
    } catch (error) {
        res.status(500).json({ message: 'Error searching datasets', error });
    }
};


exports.getDataById = async (req, res) => {

    const { id } = req.params; // Get the UCIRepoId from the request parameters
    console.log(id);
    
    try {
        // Find the dataset by UCIRepoId
        const dataset = await DatasetModel.findOne({ dataset_id:id }); // Change this line to findOne

        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        res.status(200).json(dataset);
    } catch (error) {
        console.error('Error retrieving dataset:', error);
        res.status(500).json({ message: 'Error retrieving dataset', error });
    }
};
