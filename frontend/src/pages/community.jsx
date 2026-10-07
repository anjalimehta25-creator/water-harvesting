import { useEffect, useState } from "react";
import { api } from "../services/api";

function Community() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.get("/projects/community");
        setProjects(data);
      } catch (error) {
        setError(error.message || "Failed to load community projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const totalWater = projects.reduce(
    (total, project) =>
      total + Number(project.harvestedWater || 0),
    0
  );

  const totalEstimatedWater = projects.reduce(
    (total, project) =>
      total + Number(project.estimatedAnnualCollection || 0),
    0
  );

  if (loading) {
    return (
      <div className="page">
        <h2>Community Projects</h2>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Community Projects</h1>
          <p>
            Explore verified rainwater harvesting projects
            shared by the community.
          </p>
        </div>
      </div>

      {error && <div className="message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Community Projects</h3>
          <strong>{projects.length}</strong>
        </div>

        <div className="stat-card">
          <h3>Water Harvested</h3>
          <strong>
            {totalWater.toLocaleString()} L
          </strong>
        </div>

        <div className="stat-card">
          <h3>Estimated Annual Water</h3>
          <strong>
            {totalEstimatedWater.toLocaleString()} L
          </strong>
        </div>
      </div>

      <div className="community-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No verified projects yet</h3>
            <p>
              Community projects will appear here after
              admin verification.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div className="project-card" key={project._id}>
              <div className="project-card-header">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.location}</p>
                </div>

                <span className="status verified">
                  Verified
                </span>
              </div>

              <div className="project-info">
                <div>
                  <span>Project Owner</span>
                  <strong>
                    {project.user?.name || "Community User"}
                  </strong>
                </div>

                <div>
                  <span>Catchment Area</span>
                  <strong>
                    {project.catchmentArea} m²
                  </strong>
                </div>

                <div>
                  <span>Annual Rainfall</span>
                  <strong>
                    {project.annualRainfall} mm
                  </strong>
                </div>

                <div>
                  <span>Storage Capacity</span>
                  <strong>
                    {Number(
                      project.storageCapacity || 0
                    ).toLocaleString()}{" "}
                    L
                  </strong>
                </div>

                <div>
                  <span>Estimated Collection</span>
                  <strong>
                    {Number(
                      project.estimatedAnnualCollection || 0
                    ).toLocaleString()}{" "}
                    L/year
                  </strong>
                </div>

                <div>
                  <span>Harvested Water</span>
                  <strong>
                    {Number(
                      project.harvestedWater || 0
                    ).toLocaleString()}{" "}
                    L
                  </strong>
                </div>
              </div>

              {project.description && (
                <div className="project-description">
                  <h3>Description</h3>
                  <p>{project.description}</p>
                </div>
              )}

              <div className="project-card-footer">
                <span>
                  Location:{" "}
                  {project.user?.location ||
                    project.location}
                </span>

                <span>
                  Added:{" "}
                  {project.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Community;