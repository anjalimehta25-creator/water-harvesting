import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  const getLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">💧</div>
        <div>
          <h2>RainWater</h2>
          <p>Harvesting Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={getLinkClass}>
          <span>🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/planning" className={getLinkClass}>
          <span>📋</span>
          <span>Planning</span>
        </NavLink>

        <NavLink to="/estimation" className={getLinkClass}>
          <span>💧</span>
          <span>Water Estimation</span>
        </NavLink>

        <NavLink to="/community" className={getLinkClass}>
          <span>👥</span>
          <span>Community Projects</span>
        </NavLink>

        <NavLink to="/profile" className={getLinkClass}>
          <span>👤</span>
          <span>My Profile</span>
        </NavLink>

        {user?.role === "admin" && (
          <NavLink to="/admin" className={getLinkClass}>
            <span>⚙️</span>
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>{user?.name || "User"}</strong>
            <span>{user?.role || "user"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;