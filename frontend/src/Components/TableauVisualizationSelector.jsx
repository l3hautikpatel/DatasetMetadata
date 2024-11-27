import { useState } from "react";
import TableauVisualization from "./TableauVisualization";

function TableauVisualizationSelector() {
  // Array of sheet details with number, name, and optional height
  const sheetDetails = [
    { number: 4, name: "Top Viewed Overview", height: 500 }, // Custom height
    { number: 5, name: "Top Creators", height: 350 }, // Different height
    { number: 6, name: "Licence Distribution", height: 400 },
    { number: 7, name: "Licence popularity", height: 400 },
    { number: 9, name: "Datsets grouped by Source", height: 400 },
    { number: 10, name: "Hierarchical Breakdown", height: 400 },
    { number: 11, name: "Datasets per creator", height: 400 },
    { number: 12, name: "Creator VS. Views", height: 400 },
    { number: 2, name: "Most Avaliable Keywords", height: 300 },
    { number: 8, name: "Source Distribution", height: 400 }
  ];

  // State to track selected sheets
  const [selectedSheets, setSelectedSheets] = useState([8]);

  // Base URL template
  const baseUrl = "https://public.tableau.com/views/topViewed/Sheet{number}?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link";

  // Toggle sheet selection
  const toggleSheetSelection = (sheetNumber) => {
    setSelectedSheets(prev => 
      prev.includes(sheetNumber)
        ? prev.filter(num => num !== sheetNumber)
        : [...prev, sheetNumber]
    );
  };

  return (
    <div className="space-y-4">
      {/* Dropdown Container */}
      <div className="relative group">
        <button 
          className="w-full bg-blue-700 rounded-lg text-sm hover:bg-blue-800 shadow-sm px-4 py-2 text-left"
        >
          Select Dashboards
        </button>

        {/* Dropdown Content */}
        <div className="hidden group-hover:block absolute z-10 w-full bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {sheetDetails.map((sheet) => (
            <label 
              key={sheet.number} 
              className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSheets.includes(sheet.number)}
                onChange={() => toggleSheetSelection(sheet.number)}
                className="mr-3"
              />
              <div className="flex justify-between w-full">
                <span>{sheet.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Render Selected Sheets */}
      {selectedSheets.map((sheetNumber) => {
        // Find the sheet details, including its height
        const sheetInfo = sheetDetails.find(s => s.number === sheetNumber);
        
        return (
          <div key={sheetNumber} className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {sheetInfo?.name}
            </h3>
            <TableauVisualization 
              urlTablueau={baseUrl.replace('{number}', sheetNumber)}
              passedHeight={sheetInfo?.height || 400} // Use sheet-specific height or default to 400
            />
          </div>
        );
      })}
    </div>
  );
}

export default TableauVisualizationSelector;