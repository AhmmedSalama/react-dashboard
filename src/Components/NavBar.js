import { Link, NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { RxDashboard } from "react-icons/rx";
import Cookie from "cookie-universal";

function NavBar() {
  const cookie = Cookie();
  const token = cookie.get("userToken");
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const token = cookie.get("userToken");
      const response = await fetch(
        "https://api.backendless.com/2D686640-3AF8-4C84-9DE8-BA0907098963/B78B7769-9CBD-42B3-AF6D-551310D8C7CC/users/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-token": token,
          },
        }
      );

      if (response.ok) {
        cookie.remove("userToken", { path: "/" });
        navigate("/login", { replace: true });
      } else {
        console.log("Logout failed:", response.statusText);
      }
    } catch (err) {
      console.log("Unexpected logout error:", err);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg shadow position-fixed w-100">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <RxDashboard className="me-2" />
          <span>Dashboard</span>
        </NavLink>

        {!token ? (
          <>
            {/* زرار التوجل يظهر بس لما مفيش توكن */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className='d-flex gap-3  align-items-center'>
            <Link className='btn btn-secondary' to={"dashboard"}>Dashboard</Link>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Admin
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
