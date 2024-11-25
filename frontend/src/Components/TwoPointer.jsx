import React, { useState, useEffect, useRef } from 'react';

const TwoPointer = ({ 
  title, 
  min,
  max,
  setedminvalue,
  setedmaxvalue,
  setMin,
  setMax
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [localMin, setLocalMin] = useState(setedminvalue || min);
  const [localMax, setLocalMax] = useState(setedmaxvalue || max);
  const [tempMin, setTempMin] = useState(setedminvalue || min);
  const [tempMax, setTempMax] = useState(setedmaxvalue || max);
  const dropdownRef = useRef(null);

  const validateAndSetMin = (value) => {
    let newValue = value;
    if (value === '' || isNaN(Number(value))) {
      newValue = min;
    }
    const numValue = Number(newValue);
    if (numValue < Number(min)) {
      newValue = min;
    }
    if (numValue > Number(localMax)) {
      newValue = localMax;
    }
    setLocalMin(newValue);
    setTempMin(newValue);
    setMin(String(newValue) === String(min) ? "" : newValue);
  };

  const validateAndSetMax = (value) => {
    let newValue = value;
    if (value === '' || isNaN(Number(value))) {
      newValue = max;
    }
    const numValue = Number(newValue);
    if (numValue > Number(max)) {
      newValue = max;
    }
    if (numValue < Number(localMin)) {
      newValue = localMin;
    }
    setLocalMax(newValue);
    setTempMax(newValue);
    setMax(String(newValue) === String(max) ? "" : newValue);
  };

  const handleMinChange = (value) => {
    setTempMin(value);
  };

  const handleMaxChange = (value) => {
    setTempMax(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        // Validate both inputs when clicking outside
        validateAndSetMin(tempMin);
        validateAndSetMax(tempMax);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tempMin, tempMax, localMin, localMax, min, max]);

  const handleClear = () => {
    setLocalMin(min);
    setLocalMax(max);
    setTempMin(min);
    setTempMax(max);
    setMin(""); 
    setMax(""); 
    setDropdownOpen(false);
  };

  const handleInputBlur = (type) => {
    if (type === 'min') {
      validateAndSetMin(tempMin);
    } else {
      validateAndSetMax(tempMax);
    }
  };

  const displayValue = () => {
    const isDefaultMin = String(localMin) === String(min);
    const isDefaultMax = String(localMax) === String(max);
    
    if (isDefaultMin && isDefaultMax) {
      return title;
    }
    
    return `${title}: ${localMin}-${localMax}`;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="me-3 mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {displayValue()}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 p-3 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700">
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={tempMin}
              onChange={(e) => handleMinChange(e.target.value)}
              onBlur={() => handleInputBlur('min')}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder={min}
            />
            <span className="text-gray-500 dark:text-gray-400 self-center">to</span>
            <input
              type="number"
              value={tempMax}
              onChange={(e) => handleMaxChange(e.target.value)}
              onBlur={() => handleInputBlur('max')}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder={max}
            />
          </div>
          <div className="pt-2 text-right">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white mr-2"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoPointer;