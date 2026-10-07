import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>RainWater Dashboard</h1>

      <p>Welcome to the Rainwater Harvesting Platform.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Planning</h2>
          <p>Create and manage rainwater harvesting projects.</p>
          <Link to="/planning">Go to Planning</Link>
        </div>

        <div className="dashboard-card">
          <h2>Estimation</h2>
          <p>Calculate rainwater collection and storage.</p>
          <Link to="/estimation">Go to Estimation</Link>
        </div>

        <div className="dashboard-card">
          <h2>Community</h2>
          <p>View community rainwater projects.</p>
          <Link to="/community">Go to Community</Link>
        </div>

        <div className="dashboard-card">
          <h2>Profile</h2>
          <p>View and update your profile.</p>
          <Link to="/profile">Go to Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;