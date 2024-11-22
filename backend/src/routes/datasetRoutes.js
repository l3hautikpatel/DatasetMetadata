const express = require('express');
const router = express.Router();
const DatasetController = require('../controllers/DatasetController');

// Route for searching datasets
router.get('/search', DatasetController.searchDatasets);

// Route for retrieving dataset by ID
router.get('/:id', DatasetController.getDataById);

module.exports = router;