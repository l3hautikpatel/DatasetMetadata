// models/DatasetModel.js
const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    UCIrepoId: Number,
    Timestamp: String,
    Name: String,
    DonatedDate: String,
    AbstractInfo: String,
    DatasetCharacteristics: String,
    SubjectArea: String,
    AssociatedTasks: String,
    FeatureType: String,
    Instances: Number,
    Features: Number,
    DatasetInformation: String,
    HasMissingValues: String,
    IntroductoryPapers: String,
    VariablesTable: String,
    Creators: String,
    DOI: String,
    License: String,
    Keywords: String,
    Citations: String,
    Views: String,
    // Add any other fields you expect in your documents
});

const DatasetModel = mongoose.model('metadata001', datasetSchema);
module.exports = DatasetModel;