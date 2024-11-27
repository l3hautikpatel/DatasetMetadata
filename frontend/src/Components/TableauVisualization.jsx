import React, { useEffect } from 'react';

function TableauVisualization({urlTablueau ,passedHeight = 600}) {
  useEffect(() => {
    // Dynamically load the Tableau Embedding API script
    const script = document.createElement('script');
    script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    script.type = 'module';
    document.body.appendChild(script);
  }, []);

  return (
    <div className='my-3'>
      {/* <h1>Tableau Visualization</h1> */}
      <tableau-viz className="tableauViz"
        id="tableauViz"
        src={urlTablueau}
        height={passedHeight}
        width="100%"
        toolbar="bottom"
        hide-tabs
      ></tableau-viz>
    </div>
  );
}

export default TableauVisualization;
