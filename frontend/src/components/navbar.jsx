import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">💧</span>
          <span>RainWater</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/planning">
            Planning
          </Link>

          <Link to="/estimation">
            Estimation
          </Link>

          <Link to="/community">
            Community
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin">
              Admin
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">
            {user?.name || "User"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;