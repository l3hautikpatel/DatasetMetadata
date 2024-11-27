import React from "react";

function NavBar() {
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 w-screen">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/64e4e29725c04b3719d055ad/1692721851024-TQQ4RCABD66UNB4R5DW8/image-asset.png"
              className="h-8"
              alt="Metapool Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              MetaPool
            </span>
          </a>
          <div className="flex items-center gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a href="https://kaggle.com" target="_blank">
            <img
              src="https://www.kaggle.com/static/images/logos/kaggle-logo-transparent.svg"
              className="h-8"
              alt="Metapool Logo"
            /></a>

            <a href="https://archive.ics.uci.edu" target="_blank">
            <img
              src="https://archive.ics.uci.edu/static/public/default/Small.jpg"
              className="h-8"
              alt="Metapool Logo"
            />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
