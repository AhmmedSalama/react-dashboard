import './SideBar.css';
import { NavLink } from "react-router-dom";
import { FaUsers, FaPlus, FaBoxes, FaCog , FaList } from "react-icons/fa";
import { useState, useEffect } from "react";

function SideBar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    if (isMobile) setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay للموبايل */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={`SideBar ${isOpen ? "open" : "closed"}`}>
        {isMobile && (
          <div className="sidebar-header" onClick={toggleSidebar}>
            <FaCog size={22} />
          </div>
        )}

        <NavLink to={"Clients"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
          <FaUsers size={22} />
          <span className="link-text">Clients</span>
        </NavLink>

        <NavLink to={"Clients/AddClients"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
          <FaPlus size={22} />
          <span className="link-text">Add Clients</span>
        </NavLink>

        <NavLink to={"products"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
          <FaBoxes size={22} />
          <span className="link-text">Products</span>
        </NavLink>

        <NavLink to={"products/AddProducts"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
          <FaPlus size={22} />
          <span className="link-text">Add Products</span>
        </NavLink>
        {/* Orders Page */}
<NavLink to={"Orders"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
  <FaList size={22} />
  <span className="link-text">Orders</span>
</NavLink>

{/* Add Order Page */}
<NavLink to={"Orders/AddOrder"} className="sidebar-link d-flex align-items-center gap-2 mb-2">
  <FaPlus size={22} />
  <span className="link-text">Add Order</span>
</NavLink>

      </div>
    </>
  );
}

export default SideBar;
