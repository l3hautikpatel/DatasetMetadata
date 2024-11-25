const mongoose = require('mongoose');

const kaggleSpecificSchema = new mongoose.Schema({
    subtitle: { type: String, required: true },
    usability_rating: { type: Number, required: true },
    total_votes: { type: Number, required: true },
    total_downloads: { type: Number, required: true },
    is_private: { type: Boolean, required: true },
}, { _id: false }); // Prevent creating an additional _id field for this sub-document

const uciSpecificSchema = new mongoose.Schema({
    donated_date: { type: Date, required: true },
    dataset_characteristics: { type: String, required: true },
    subject_area: { type: String, required: true },
    associated_tasks: { type: String, required: true },
    feature_type: { type: String, required: true },
    instances: { type: Number, required: true },
    features: { type: Number, required: true },
    has_missing_values: { type: String, required: true }, // Consider changing to Boolean if applicable
    introductory_papers: { type: String, required: true },
    variables_table: { type: String, required: true },
    citations: { type: Number, default: 0 }, // Default value for citations
    additional_variable_info: { type: String }, // Optional field
    dataset_files: { type: String }, // Optional field
}, { _id: false }); // Prevent creating an additional _id field for this sub-document

const datasetSchema = new mongoose.Schema({
    dataset_id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    url: { type: String, required: true },
    keywords: { type: [String], default: [] }, // Array of strings for keywords
    license: { type: mongoose.Schema.Types.Mixed, required: true }, // Mixed type to allow both string and array of strings
    views: { type: Number, default: 0 }, // Default value for views
    source: { type: String, required: true },
    integration_timestamp: { type: Date, required: true },
    kaggle_specific: kaggleSpecificSchema, // Include kaggle specific fields
    uci_specific: uciSpecificSchema, // Include UCI specific fields
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const DatasetModel = mongoose.model('metapool_sets', datasetSchema);
module.exports = DatasetModel;