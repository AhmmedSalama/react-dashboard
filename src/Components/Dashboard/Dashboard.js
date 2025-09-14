import NavBar from "../NavBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

function Dashboard() {
return (
    <div>
      <SideBar />
      <div style={{marginTop:"58px"}} className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
