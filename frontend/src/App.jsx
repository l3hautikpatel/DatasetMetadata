import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SearchBar from "./Components/SearchBar";
import Filter from "./Components/Filter";
import RepoMetadataComp from "./Components/RepoMetadataComp";
import NavBar from "./Components/NavBar";

function App() {
  const [searchString, setSearchString] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [views, setViews] = useState(""); 

  return (
    <>

      <NavBar />
      <SearchBar searchString={searchString} setSearchString={setSearchString} />
      <h3 className="flex justify-center w-screen" >{searchString} + {year} + {type} + {views}</h3>
      {/* Pass props to Filter components */}

      
    <div className="flex justify-center w-screen">
      <Filter title="Year" options={["2022", "2021", "2020", "2019", "2018",""]} selectedOption={year} setSelectedOption={setYear} />
      <Filter title="Type" options={["Type1", "Type2", "Type3"]} selectedOption={type} setSelectedOption={setType} />
      <Filter title="Views" options={["View1", "View2", "View3"]} selectedOption={views} setSelectedOption={setViews} />
      
      </div>

      <div className="mainComp bg-cyan-950 p-10 mt-40 mb-10 flex gap-3 w-screen rounded-xl overflow-hidden ">
        <div className="flex-[7]">
          <RepoMetadataComp id="45"/>
          <RepoMetadataComp id="75"/>
        </div>
        <div className="flex-[3]">
          
          

        </div>
      </div>
    </>
  );
}

export default App;