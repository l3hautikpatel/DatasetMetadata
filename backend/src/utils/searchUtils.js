const DatasetModel = require('../models/DatasetModel');

exports.processSearchQuery = async (req) => {
    try {
        const {
            query,
            source,
            votesMin,
            votesMax,
            downloadMin,
            downloadMax,
            missingValues,
            instancesMin,
            instancesMax,
            viewsMin,
            viewsMax,
            page = 1,
            limit = 10
        } = req.query;

        // Create the base query object
        let searchCriteria = {};

        // Handle the search query for title, description, and keywords
        if (query) {
            const searchTerms = query.split(' ')
                .map(term => term.trim())
                .filter(term => term.length > 0)
                .map(term => term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));

            if (searchTerms.length > 0) {
                searchCriteria.$or = [
                    { title: { $regex: searchTerms.join('|'), $options: 'i' } },
                    { description: { $regex: searchTerms.join('|'), $options: 'i' } },
                    { keywords: { $in: searchTerms.map(term => new RegExp(term, 'i')) } }
                ];
            }
        }

        // Convert source to lowercase for case-insensitive checks
        const normalizedSource = source ? source.toLowerCase() : null;

        // Source filter
        if (normalizedSource) {
            searchCriteria.source = { $regex: new RegExp(`^${normalizedSource}$`, 'i') };
        }

        // Kaggle-specific filters
        if (normalizedSource === 'kaggle') {
            if (votesMin || votesMax) {
                searchCriteria['kaggle_specific.total_votes'] = {};
                if (votesMin) searchCriteria['kaggle_specific.total_votes'].$gte = parseInt(votesMin);
                if (votesMax) searchCriteria['kaggle_specific.total_votes'].$lte = parseInt(votesMax);
            }

            if (downloadMin || downloadMax) {
                searchCriteria['kaggle_specific.total_downloads'] = {};
                if (downloadMin) searchCriteria['kaggle_specific.total_downloads'].$gte = parseInt(downloadMin);
                if (downloadMax) searchCriteria['kaggle_specific.total_downloads'].$lte = parseInt(downloadMax);
            }
        }

        // UCI-specific filters
        if (normalizedSource === 'uci') {
            if (instancesMin || instancesMax) {
                searchCriteria['uci_specific.instances'] = {};
                if (instancesMin) searchCriteria['uci_specific.instances'].$gte = parseInt(instancesMin);
                if (instancesMax) searchCriteria['uci_specific.instances'].$lte = parseInt(instancesMax);
            }

            if (missingValues) {
                searchCriteria['uci_specific.has_missing_values'] = missingValues;
            }
        }

        // Views filter (common for both sources)
        if (viewsMin || viewsMax) {
            searchCriteria.views = {};
            if (viewsMin) searchCriteria.views.$gte = parseInt(viewsMin);
            if (viewsMax) searchCriteria.views.$lte = parseInt(viewsMax);
        }

        // Clean up empty objects in searchCriteria
        Object.keys(searchCriteria).forEach(key => {
            if (Object.keys(searchCriteria[key]).length === 0) {
                delete searchCriteria[key];
            }
        });

        console.log('Search Criteria:', JSON.stringify(searchCriteria, null, 2));

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute the query
        const results = await DatasetModel.find(searchCriteria)
            .select('dataset_id')
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await DatasetModel.countDocuments(searchCriteria);

        // Extract dataset_ids
        const datasetIds = results.map(result => result.dataset_id);

        return {
            success: true,
            data: {
                datasetIds,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalItems: totalCount,
                    itemsPerPage: parseInt(limit)
                }
            }
        };

    } catch (error) {
        console.error('Search Query Error:', error);
        return {
            success: false,
            message: 'An error occurred while processing your request.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
    }
};
