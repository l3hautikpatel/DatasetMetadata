// models/DatasetModel.js
const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    UCIrepoId: { type: Number, required: true },
    Timestamp: { type: Date, required: true }, // Change to Date type for better handling of timestamps
    Name: { type: String, required: true },
    DonatedDate: { type: Date, required: true }, // Change to Date type
    AbstractInfo: { type: String, required: true },
    DatasetCharacteristics: { type: String, required: true },
    SubjectArea: { type: String, required: true },
    AssociatedTasks: { type: String, required: true },
    FeatureType: { type: String, required: true },
    Instances: { type: Number, required: true },
    Features: { type: Number, required: true },
    DatasetInformation: { type: String, required: true },
    HasMissingValues: { type: String, required: true }, // Could be Boolean if you want to simplify
    IntroductoryPapers: { type: String, required: true },
    VariablesTable: { type: String, required: true },
    Creators: { type: String, required: true },
    DOI: { type: String, required: true },
    License: { type: String, required: true },
    Keywords: { type: [String], default: [] }, // Change to an array of strings
    Citations: { type: Number, default: 0 }, // Change to Number for better handling
    Views: { type: Number, default: 0 }, // Change to Number for better handling
    AdditionalVariableInfo: { type: String }, // Optional field
    DatasetFiles: { type: String }, // Optional field
    SearchingWords: { type: [String], default: [] }, // Change to an array of strings
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const DatasetModel = mongoose.model('metapool_sets', datasetSchema);
module.exports = DatasetModel;