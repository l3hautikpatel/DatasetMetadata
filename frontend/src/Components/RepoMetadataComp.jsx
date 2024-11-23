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

    const renderField = (label, value) => {
        if (value && value !== "NOT AVAILABLE") {
            return (
                <div className="p-1">
                    <h2 className="text-sm font-semibold text-white">{label}:</h2>
                    <p className="text-gray-300 text-xs">{value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-800 p-4 mt-10 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-white">{data.Name}</h1>
            <p className="text-gray-300 text-sm mt-1">{data.AbstractInfo}</p>
            
            <div className="grid grid-cols-4 gap-2 mt-4">
                {renderField("Characteristics", data.DatasetCharacteristics)}
                {renderField("Subject Area", data.SubjectArea)}
                {renderField("Associated Tasks", data.AssociatedTasks)}
                {renderField("Instances", data.Instances)}
                {renderField("Features", data.Features)}
                {renderField("Citations", data.Citations)}
                {renderField("Views", data.Views)}
                {renderField("Creators", data.Creators)}
                
                {data.License && data.License !== "NOT AVAILABLE" && (
                    <div className="p-1 col-span-4">
                        <h2 className="text-sm font-semibold text-white">License:</h2>
                        <p className="text-gray-300 text-xs">{data.License}</p>
                    </div>
                )}

                {data.DOI && data.DOI !== "NOT AVAILABLE" && (
                    <div className="p-1 col-span-4">
                        <a
                            href={`https://${data.DOI}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-xs hover:underline"
                        >
                            Redirect to Source Repo.
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RepoMetadataComp;