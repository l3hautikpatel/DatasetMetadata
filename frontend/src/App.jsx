// App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Components/NavBar";
import SearchBar from "./Components/SearchBar";
import Filter from "./Components/Filter";
import RepoMetadataComp from "./Components/RepoMetadataComp";
import TwoPointer from "./Components/TwoPointer";
import "./app.css";
import Pagination from "./Components/Pagination";
import TableauVisualizationSelector from "./Components/TableauVisualizationSelector";


function App() {
  // Search and Pagination States
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Common Filters
  const [viewsMin, setViewsMin] = useState("");
  const [viewsMax, setViewsMax] = useState("");
  const [source, setSource] = useState("");

  // Kaggle Filters
  const [usabilityRating, setUsabilityRating] = useState("");
  const [votesMin, setVotesMin] = useState("");
  const [votesMax, setVotesMax] = useState("");
  const [downloadMin, setDownloadMin] = useState("");
  const [downloadMax, setDownloadMax] = useState("");

  // UCI Filters
  const [missingValues, setMissingValues] = useState("");
  const [instancesMin, setInstancesMin] = useState("");
  const [instancesMax, setInstancesMax] = useState("");

  // Results State
  const [repoIds, setRepoIds] = useState([]);



  useEffect(() => {
    const lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch) {
      setSearchString(lastSearch);
    }
  }, []);



  // Fetch Data Effect
  useEffect(() => {
    const fetchData = async () => {
      if (searchString || source) {
        setIsLoading(true);
        const queryString = buildQueryString();
        try {
          const response = await axios.get(
            `http://localhost:5000/api/datasets/search${queryString}`
          );
          
          const { datasetIds, pagination } = response.data.data;
          setRepoIds(datasetIds);
          setTotalPages(pagination.totalPages);
          setTotalItems(pagination.totalItems);
          
          // Reset to page 1 if current page is beyond total pages
          if (currentPage > pagination.totalPages) {
            setCurrentPage(1);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setRepoIds([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    };
    localStorage.setItem("lastSearch", searchString);
    fetchData();
  }, [
    searchString,
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
    currentPage,
    itemsPerPage
  ]);

  // Update Source Based on Filters Effect
  useEffect(() => {
    if (votesMin || votesMax || usabilityRating || downloadMin || downloadMax) {
      setSource("Kaggle");
    } else if (missingValues || instancesMin || instancesMax) {
      setSource("UCI");
    }
  }, [
    votesMin,
    votesMax,
    usabilityRating,
    downloadMin,
    downloadMax,
    missingValues,
    instancesMin,
    instancesMax
  ]);

  // Build Query String Function
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
    
    // Pagination parameters
    params.append("page", currentPage);
    params.append("limit", itemsPerPage);

    return params.toString() ? `?${params.toString()}` : "";
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchString("");
    setSource("");
    setViewsMin("");
    setViewsMax("");
    setVotesMin("");
    setVotesMax("");
    setDownloadMin("");
    setDownloadMax("");
    setMissingValues("");
    setInstancesMin("");
    setInstancesMax("");
    setUsabilityRating("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Search Section */}
      <div className="container mx-auto px-4 py-6 w-screen">
        <SearchBar
          searchString={searchString}
          setSearchString={setSearchString}
        />
        
        {totalItems > 0 && (
          <div className="text-center text-gray-600 mt-4 w-screen">
            Found {totalItems} datasets
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex justify-center w-screen">
        <div className=" rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-1 items-center">
            <Filter
              title="Source"
              options={["Kaggle", "UCI"]}
              selectedOption={source}
              setSelectedOption={setSource}
            />

            {/* Kaggle Filters */}
            {(source === "Kaggle" || source === "") && (
              <>
                <TwoPointer
                  title="Votes"
                  min="0"
                  max="1000"
                  setedminvalue={votesMin}
                  setMin={setVotesMin}
                  setedmaxvalue={votesMax}
                  setMax={setVotesMax}
                />
                {/* <Filter
                  title="Usability Rating"
                  options={["0.0-0.3", "0.3-0.5", "0.5-0.7", "0.7-1"]}
                  selectedOption={usabilityRating}
                  setSelectedOption={setUsabilityRating}
                /> */}
                <TwoPointer
                  title="Downloads"
                  min="0"
                  max="1000"
                  setedminvalue={downloadMin}
                  setMin={setDownloadMin}
                  setedmaxvalue={downloadMax}
                  setMax={setDownloadMax}
                />
              </>
            )}

            {/* UCI Filters */}
            {(source === "UCI" || source === "") && (
              <>
                <Filter
                  title="Missing Values"
                  options={["Yes", "No"]}
                  selectedOption={missingValues}
                  setSelectedOption={setMissingValues}
                />
                <TwoPointer
                  title="Instances"
                  min="0"
                  max="1000"
                  setedminvalue={instancesMin}
                  setMin={setInstancesMin}
                  setedmaxvalue={instancesMax}
                  setMax={setInstancesMax}
                />
              </>
            )}

            {/* Common Filters */}
            <TwoPointer
              title="Views"
              min="0"
              max="1000"
              setedminvalue={viewsMin}
              setMin={setViewsMin}
              setedmaxvalue={viewsMax}
              setMax={setViewsMax}
            />

            {/* Reset Filters Button */}
            {/* <button
              onClick={resetFilters}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset Filters
            </button> */}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mainComp bg-cyan-950 p-10 mt-40 mb-10 flex gap-3 w-screen rounded-xl overflow-hidden">
        <div className="bg-cyan-950 rounded-xl p-6 mb-10 w-screen">
          <div className="flex gap-6">
            <div className="flex-[7]">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : repoIds.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {repoIds.map((id) => (
                      <RepoMetadataComp key={id} id={id} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center text-gray-400 py-10">
                  {searchString || source ? 
                    "No datasets found. Try adjusting your search or filters." :
                    "Start by entering a search term or selecting filters."}
                </div>
              )}
            </div>
            <div className="flex-[3]">
              {/* Additional content or sidebar can go here */}
              {/* <TableauVisualization urlTablueau="https://public.tableau.com/views/Book2_17325791102700/Sheet2" passedHeight={300} />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/BarChartForKeywordCount/Sheet1?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/SourceDistribution/Sheet8?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"  passedHeight={300} />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/toCreators/Sheet5?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet4?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet6?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet7?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" passedHeight={400}/>
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet9?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet10?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet11?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" />
              <TableauVisualization urlTablueau="https://public.tableau.com/views/topViewed/Sheet12?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" /> */}


              <TableauVisualizationSelector />


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 