import { useEffect, useState } from "react";
import { api } from "../services/api";

function Admin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProjects: 0,
    verifiedProjects: 0,
    totalWater: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAdminData = async () => {
    try {
      const [usersData, projectsData, analyticsData] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/projects"),
        api.get("/admin/analytics")
      ]);

      setUsers(usersData);
      setProjects(projectsData);
      setAnalytics(analyticsData);
    } catch (error) {
      setMessage(error.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const verifyProject = async (id) => {
    try {
      await api.patch(`/admin/projects/${id}/verify`);
      setMessage("Project verified successfully");
      loadAdminData();
    } catch (error) {
      setMessage(error.message || "Failed to verify project");
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      setMessage("User deleted successfully");
      loadAdminData();
    } catch (error) {
      setMessage(error.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Admin Panel</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage users, projects and water conservation data.</p>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <strong>{analytics.totalUsers}</strong>
        </div>

        <div className="stat-card">
          <h3>Total Projects</h3>
          <strong>{analytics.totalProjects}</strong>
        </div>

        <div className="stat-card">
          <h3>Verified Projects</h3>
          <strong>{analytics.verifiedProjects}</strong>
        </div>

        <div className="stat-card">
          <h3>Estimated Water</h3>
          <strong>
            {Number(analytics.totalWater || 0).toLocaleString()} L
          </strong>
        </div>
      </div>

      <section className="admin-section">
        <div className="section-header">
          <h2>Users</h2>
          <span>{users.length} users</span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.location || "Not provided"}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role !== "admin" && (
                        <button
                          className="danger-btn"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2>Projects</h2>
          <span>{projects.length} projects</span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Water Estimate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6">No projects found</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.user?.name || "Unknown"}</td>
                    <td>{project.location}</td>
                    <td>
                      {Number(
                        project.estimatedAnnualCollection || 0
                      ).toLocaleString()}{" "}
                      L
                    </td>
                    <td>
                      <span
                        className={
                          project.verified
                            ? "status verified"
                            : "status pending"
                        }
                      >
                        {project.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {!project.verified && (
                        <button
                          className="primary-btn"
                          onClick={() => verifyProject(project._id)}
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Admin;