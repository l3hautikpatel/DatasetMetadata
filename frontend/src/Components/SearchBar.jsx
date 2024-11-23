import React, { useEffect, useState } from "react";

function SearchBar({ searchString, setSearchString }) {
  const [inputValue, setInputValue] = useState(searchString); // Local state for input
  const [debounceTimeout, setDebounceTimeout] = useState(null); // State to hold the timeout ID

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update local input state

    // Clear the previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout
    setDebounceTimeout(
      setTimeout(() => {
        setSearchString(event.target.value); // Update the search string state after 3 seconds
        console.log("Searching for:", event.target.value); // Replace this with your API call
      }, 3000) // Adjust the delay as needed (3000ms for 3 seconds)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    setSearchString(inputValue); // Immediately set the search string on submit
    console.log("Submitted search for:", inputValue); // Replace this with your API call
  };

  useEffect(() => {
    // Update the input value if the searchString prop changes
    setInputValue(searchString);
  }, [searchString]);

  return (
    <div className="flex justify-center w-screen">
    <form className="max-w-md mx-auto pb-4 pt-5 w-screen" onSubmit={handleSubmit}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Mockups, Logos..."
          value={inputValue} // Controlled input
          onChange={handleInputChange} // Handle input changes
          required
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </form>
    </div>
  );
}

export default SearchBar;