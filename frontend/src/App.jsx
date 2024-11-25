import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import NavBar from "./Components/NavBar";
import SearchBar from "./Components/SearchBar";
import Filter from "./Components/Filter";
import RepoMetadataComp from "./Components/RepoMetadataComp";

import './app.css'
import TwoPointer from "./Components/TwoPointer";

function App() {
  const [searchString, setSearchString] = useState("");
  
  // common filters
  const [viewsMin, setViewsMin] = useState("");
  const [viewsMax, setViewsMax] = useState("");
  const [source, setSource] = useState(""); 

  // kaggle filters 
  const [usabilityRating, setUsabilityRating] = useState("");
  const [votesMin,setVotesMin] = useState("");
  const [votesMax,setVotesMax] = useState("");
  const [downloadMin, setDownloadMin] = useState("");
  const [downloadMax, setDownloadMax] = useState("");

  // uci filters
  const [missingValues, setMissingValues] = useState("");
  const [instancesMin, setInstancesMin] = useState("");
  const [instancesMax, setInstancesMax] = useState("");

  const [repoIds, setRepoIds] = useState([]);

  useEffect(() => {
    const lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch) {
      setSearchString(lastSearch);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (searchString) {
        const queryString = buildQueryString();
        try {
          const response = await axios.get(`http://localhost:5000/api/datasets/search${queryString}`);
          setRepoIds(response.data.ids);
          localStorage.setItem("lastSearch", searchString);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [searchString, source, votesMin, votesMax, downloadMin, downloadMax, missingValues, instancesMin, instancesMax, viewsMin, viewsMax]);

  // Update source based on selected filters
  useEffect(() => {
    if (votesMin || votesMax || usabilityRating || downloadMin || downloadMax) {
      setSource("Kaggle");
    } else if (missingValues || instancesMin || instancesMax || viewsMin || viewsMax) {
      setSource("UCI");
    } else {
      setSource("");
    }
  }, [votesMin, votesMax, usabilityRating, downloadMin, downloadMax, missingValues, instancesMin, instancesMax, viewsMin, viewsMax]);

  // Function to build the query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchString) params.append("query", searchString);
    if (source) params.append("source", source);
    if (votesMin) params.append("votesMin", votesMin);
    if (votesMax) params.append("votesMax", votesMax);
    if (downloadMin) params.append("downloadMin", downloadMin);
    if (downloadMax) params.append("downloadMax", downloadMax);
    if (missingValues) params.append("missingValues", missingValues);
    if (instancesMin) params.append("instancesMin", instancesMin);
    if (instancesMax) params.append("instancesMax", instancesMax);
    if (viewsMin) params.append("viewsMin", viewsMin);
    if (viewsMax) params.append("viewsMax", viewsMax);

    // Return the query string
    return params.toString() ? `?${params.toString()}` : '';
  };

  return (
    <>
      <NavBar />
      <SearchBar searchString={searchString} setSearchString={setSearchString} />
      <h3 className="flex justify-center w-screen">{}</h3>
      
      <div className="flex justify-center w-screen">
        <Filter title="Source" options={["Kaggle", "UCI"]} selectedOption={source} setSelectedOption={setSource} />

        {/* Conditional rendering based on selected source */}
        {source === "Kaggle" || source === "" ? (
          <>
            <TwoPointer title="Votes" min={"0"} setedminvalue={votesMin} setedmaxvalue={votesMax} setMin={setVotesMin} max={"1000"} setMax={setVotesMax} />
            <Filter title="Usability Rating" options={["0.0-0.3", "0.3-0.5", "0.5-0.7", "0.7-1"]} selectedOption={usabilityRating} setSelectedOption={setUsabilityRating} />
            <TwoPointer title="Downloads" min={"0"} max={"1000"} setedminvalue={downloadMin} setMin={setDownloadMin} setedmaxvalue={downloadMax} setMax={setDownloadMax} />
          </>
        ) : null}

        {source === "UCI" || source === "" ? (
          <>
            <Filter title={"Missing Values"} options={["Yes", "No"]} selectedOption={missingValues} setSelectedOption={setMissingValues} />
            <TwoPointer title={"Instances"} min={"0"} max={"1000"} setedminvalue={instancesMin} setMin={setInstancesMin} setedmaxvalue={instancesMax} setMax={setInstancesMax} />
            <TwoPointer title={"Views"} min={"0"} max={"1000"} setedminvalue={viewsMin} setMin={setViewsMin} setedmaxvalue={viewsMax} setMax={setViewsMax} />
          </>
        ) : null}
      </div>

      <div className="mainComp bg-cyan-950 p-10 mt-40 mb-10 flex gap-3 w-screen rounded-xl overflow-hidden">
        <div className="flex-[7]">
          {repoIds.map(id => (
            <RepoMetadataComp key={id} id={id} />
          ))}
        </div>
        <div className="flex-[3]">

          
          {/* Other components can go here */}
        </div>
      </div>
    </>
  );
}

export default App;