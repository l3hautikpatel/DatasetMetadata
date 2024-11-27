import React, { useEffect, useState } from "react";
import axios from "axios";

function RepoMetadataComp(props) {
  const { id } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/datasets/${id}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const formatNumber = (num) => {
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return `${formatted}k`.replace(".0k", "k");
    }
    return num.toString();
  };

  const renderField = (label, value) => {
    if (value && value !== "NOT AVAILABLE") {
      return (
        <div className="p-1">
          <h2 className="text-sm font-semibold text-white">{label}:</h2>
          <p className="text-gray-300 text-xs">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderSourceSpecificFields = () => {
    if (data.source?.toLowerCase() === "kaggle" && data.kaggle_specific) {
      return (
        <>
          {renderField(
            "Usability Rating",
            `${(data.kaggle_specific.usability_rating * 100).toFixed(1)}%`
          )}
          {renderField("Total Votes", data.kaggle_specific.total_votes)}
          {renderField("Total Downloads", data.kaggle_specific.total_downloads)}
          {renderField(
            "Private",
            data.kaggle_specific.is_private ? "Yes" : "No"
          )}
        </>
      );
    } else if (data.source?.toLowerCase() === "uci" && data.uci_specific) {
      return (
        <>
          {renderField(
            "Characteristics",
            data.uci_specific.dataset_characteristics
          )}
          {renderField("Subject Area", data.uci_specific.subject_area)}
          {renderField("Associated Tasks", data.uci_specific.associated_tasks)}
          {renderField("Features", data.uci_specific.features)}
          {renderField("Instances", data.uci_specific.instances)}
          {renderField("Citations", data.uci_specific.citations)}
        </>
      );
    }
    return null;
  };

  const getSourceImage = () => {
    const sourceType = data.source?.toLowerCase();
    if (sourceType === "kaggle") {
      return "https://www.kaggle.com/static/images/logos/kaggle-logo-transparent.svg";
    } else if (sourceType === "uci") {
      return "https://archive.ics.uci.edu/static/public/default/Small.jpg";
    }
    return null;
  };

  const truncateDescription = (text, limit = 200) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
  };

  return (
    <div className="bg-gray-800 p-4 mt-10 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-white flex items-center justify-center">
        {data.title}
        {getSourceImage() && (
          <img
            src={getSourceImage()}
            className="h-8 ml-2"
            alt={`${data.source} Logo`}
          />
        )}
      </h1>

      <p className="text-gray-300 text-sm mt-1">
        {truncateDescription(data.description)}
      </p>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {renderField("Creator", data.creator)}
        {renderField("Views", data.views)}
        {renderSourceSpecificFields()}

        {/* License - Full width */}
        {data.license && data.license !== "NOT AVAILABLE" && (
          <div className="p-1 col-span-5">
            <h2 className="text-sm font-semibold text-white">License:</h2>
            <p className="text-gray-300 text-xs">
              {typeof data.license === "string"
                ? data.license
                : Array.isArray(data.license)
                ? data.license.map((l) => l.name || l).join(", ")
                : data.license.name || "License information not available"}
            </p>
          </div>
        )}

        {/* URL - Full width */}
        {data.source?.toLowerCase() === "kaggle" && data.url && (
          <div className="p-1 col-span-5">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-xs hover:underline"
            >
              Redirect to Source Repo.
            </a>
          </div>
        )}

        {data.source?.toLowerCase() === "uci"  && (
          <div className="p-1 col-span-5">
            <a
              href={`https://${data.url}`}
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
