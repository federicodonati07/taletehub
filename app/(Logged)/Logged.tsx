import React, { useState } from "react";
import { FaRegUserCircle, FaUserCircle, FaSearch } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import Home from "./Home";
import User from "./User";

const Logged = () => {
  const [activeSection, setActiveSection] = useState("home");

  const handleToggle = (section: string) => {
    if (activeSection !== section) {
      setActiveSection(section);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen flex flex-col m-2">
        {/* Contenuto principale, centrato orizzontalmente */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl mx-auto">
            {activeSection === "home" && <Home />}
            {activeSection === "search" && <div>Search Section</div>}
            {activeSection === "add" && <div>Add Section</div>}
            {activeSection === "user" && <User />}
          </div>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 w-full text-white bg-black">
          <div className="grid grid-cols-4 gap-10 text-center m-5">
            <div onClick={() => handleToggle("home")}>
              {activeSection === "home" ? (
                <IoHomeSharp className="font-bold text-2xl" />
              ) : (
                <IoHomeOutline className="font-bold text-2xl cursor-pointer" />
              )}
            </div>
            <div onClick={() => handleToggle("search")}>
              {activeSection === "search" ? (
                <FaSearch className="font-bold text-2xl" />
              ) : (
                <IoSearchOutline className="font-normal text-2xl cursor-pointer" />
              )}
            </div>
            <div onClick={() => handleToggle("add")}>
              {activeSection === "add" ? (
                <IoIosAddCircle className="font-bold text-2xl" />
              ) : (
                <IoIosAddCircleOutline className="font-bold text-2xl cursor-pointer" />
              )}
            </div>
            <div onClick={() => handleToggle("user")}>
              {activeSection === "user" ? (
                <FaUserCircle className="font-bold text-2xl" />
              ) : (
                <FaRegUserCircle className="font-bold text-2xl cursor-pointer" />
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Logged;
