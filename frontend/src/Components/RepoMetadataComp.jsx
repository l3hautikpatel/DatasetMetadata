import React, { useEffect, useState } from 'react';
import axios from 'axios';
function RepoMetadataComp(props) {
    const { id } = props; // Get the dataset ID from props
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/datasets/${id}`);
                console.log(response.data);
                setData(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    return (
        <div className="bg-gray-800 p-6 mt-10 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white">{data.Name}</h1>
            <p className="text-gray-300 mt-2">{data.AbstractInfo}</p>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Dataset Characteristics:</h2>
                <p className="text-gray-300">{data.DatasetCharacteristics}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Subject Area:</h2>
                <p className="text-gray-300">{data.SubjectArea}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Associated Tasks:</h2>
                <p className="text-gray-300">{data.AssociatedTasks}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Instances:</h2>
                <p className="text-gray-300">{data.Instances}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Features:</h2>
                <p className="text-gray-300">{data.Features}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">License:</h2>
                <p className="text-gray-300">{data.License}</p>
            </div>
            <div className="mt-4">
                <a
                    href={`https://${data.DOI}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >   Redirect to DOI
                </a>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Citations:</h2>
                <p className="text-gray-300">{data.Citations}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Views:</h2>
                <p className="text-gray-300">{data.Views}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-white">Creators:</h2>
                <p className="text-gray-300">{data.Creators}</p>
            </div>
        </div>
    );
}
export default RepoMetadataComp;