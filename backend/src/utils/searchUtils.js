const DatasetModel = require('../models/DatasetModel');


let numberOfResults = 20;

//http://localhost:5000/api/datasets/search?query=searchString&source=Kaggle&votesMin=10&votesMax=100&downloadMin=1000&downloadMax=10000&missingValues=Yes&instancesMin=50&instancesMax=500&viewsMin=0&viewsMax=1000
exports.processSearchQuery = async (req) => {
    const { query , date , name } = req.query; // Get the search string from the request
    console.log(query + " : RECIEVED QUERY");
    console.log(name);
    console.log(date);
    try {
        // Split the query into individual words
        const searchWords = query.toLowerCase().split(/\s+/);

        // Create a complex search pipeline
        const pipeline = [
            {
                $match: {
                    $or: [
                        // Full name match (highest priority)
                        { Name: { $regex: query, $options: 'i' } },
                        
                        // Individual word matches in different fields
                        { 
                            $or: searchWords.map(word => ({
                                $or: [
                                    { Name: { $regex: word, $options: 'i' } },
                                    { SubjectArea: { $regex: word, $options: 'i' } },
                                    { SearchingWords: { $regex: word, $options: 'i' } },
                                    { AbstractInfo: { $regex: word, $options: 'i' } }
                                ]
                            }))
                        }
                    ]
                }
            },
            {
                // Add relevance scoring
                $addFields: {
                    relevanceScore: {
                        $sum: [
                            // Exact name match gets highest score
                            { $cond: [{ $eq: [{ $toLower: "$Name" }, query.toLowerCase()] }, 1000, 0] },
                            
                            // Partial name match
                            { $cond: [{ $regexMatch: { input: "$Name", regex: query, options: "i" } }, 100, 0] },
                            
                            // Individual word matches
                            {
                                $sum: searchWords.map(word => ({
                                    $sum: [
                                        { $cond: [{ $regexMatch: { input: "$Name", regex: word, options: "i" } }, 50, 0] },
                                        { $cond: [{ $regexMatch: { input: "$SubjectArea", regex: word, options: "i" } }, 20, 0] },
                                        { $cond: [{ $regexMatch: { input: "$SearchingWords", regex: word, options: "i" } }, 10, 0] }
                                    ]
                                }))
                            }
                        ]
                    }
                }
            },
            // Sort by relevance score
            { $sort: { relevanceScore: -1 } },
            
            // Limit to top 10 results
            { $limit: numberOfResults },
            
            // Project only the UCIrepoId
            { $project: { UCIrepoId: 1, _id: 0 } }
        ];

        // Execute the aggregation pipeline
        const results = await DatasetModel.aggregate(pipeline);

        // Return the UCIrepoId values
        return { 
            ids: results.map(result => result.UCIrepoId),
            count: results.length
        };
    } catch (error) {
        console.error('Error processing search query:', error);
        throw error;
    }
};