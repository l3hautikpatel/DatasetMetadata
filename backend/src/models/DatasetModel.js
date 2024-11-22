const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true },
    // Add other fields as necessary
});

const DatasetModel = mongoose.model('Dataset', datasetSchema);
module.exports = DatasetModel;