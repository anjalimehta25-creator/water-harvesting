import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [harvestedWater, setHarvestedWater] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProject = async () => {
    try {
      const data = await api.get(`/projects/${id}`);

      setProject(data);
      setHarvestedWater(data.harvestedWater || 0);
    } catch (error) {
      setError(error.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleWaterUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data = await api.patch(
        `/projects/${id}/harvested-water`,
        {
          harvestedWater: Number(harvestedWater)
        }
      );

      setProject(data.project);
      setMessage("Harvested water updated successfully");
    } catch (error) {
      setError(
        error.message || "Failed to update harvested water"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");
    setMessage("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("design", file);

      const data = await api.upload(
        `/projects/${id}/design`,
        formData
      );

      setProject(data.project);
      setFile(null);
      setMessage("Design uploaded successfully");
    } catch (error) {
      setError(error.message || "Failed to upload design");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Project Details</h2>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <h2>Project Not Found</h2>
        <p>{error || "The requested project does not exist."}</p>
        <Link to="/dashboard" className="primary-btn">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{project.title}</h1>
          <p>{project.location}</p>
        </div>

        <div className="header-actions">
          <Link
            to="/dashboard"
            className="secondary-btn"
          >
            Back to Dashboard
          </Link>

          <button
            className="danger-btn"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="project-status">
        <span
          className={
            project.verified
              ? "status verified"
              : "status pending"
          }
        >
          {project.verified
            ? "Verified Project"
            : "Pending Verification"}
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Catchment Area</h3>
          <strong>
            {project.catchmentArea} m²
          </strong>
        </div>

        <div className="stat-card">
          <h3>Annual Rainfall</h3>
          <strong>
            {project.annualRainfall} mm
          </strong>
        </div>

        <div className="stat-card">
          <h3>Estimated Collection</h3>
          <strong>
            {Number(
              project.estimatedAnnualCollection || 0
            ).toLocaleString()}{" "}
            L
          </strong>
        </div>

        <div className="stat-card">
          <h3>Storage Capacity</h3>
          <strong>
            {Number(
              project.storageCapacity || 0
            ).toLocaleString()}{" "}
            L
          </strong>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h2>Project Information</h2>

          <div className="details-list">
            <div>
              <span>Project Name</span>
              <strong>{project.title}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{project.location}</strong>
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
              <span>Runoff Coefficient</span>
              <strong>
                {project.runoffCoefficient}
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
              <span>Installation Date</span>
              <strong>
                {project.installationDate
                  ? new Date(
                      project.installationDate
                    ).toLocaleDateString()
                  : "Not provided"}
              </strong>
            </div>

            <div>
              <span>Created On</span>
              <strong>
                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </strong>
            </div>
          </div>

          {project.description && (
            <div className="project-description">
              <h3>Description</h3>
              <p>{project.description}</p>
            </div>
          )}
        </div>

        <div className="details-card">
          <h2>Water Tracking</h2>

          <div className="water-highlight">
            <span>Total Harvested Water</span>
            <strong>
              {Number(
                project.harvestedWater || 0
              ).toLocaleString()}{" "}
              L
            </strong>
          </div>

          <form onSubmit={handleWaterUpdate}>
            <div className="form-group">
              <label htmlFor="harvestedWater">
                Update Harvested Water (L)
              </label>

              <input
                id="harvestedWater"
                type="number"
                min="0"
                step="0.01"
                value={harvestedWater}
                onChange={(e) =>
                  setHarvestedWater(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Water"}
            </button>
          </form>

          <div className="progress-section">
            <div className="progress-header">
              <span>Collection Progress</span>

              <strong>
                {project.estimatedAnnualCollection
                  ? Math.min(
                      100,
                      Math.round(
                        (project.harvestedWater /
                          project.estimatedAnnualCollection) *
                          100
                      )
                    )
                  : 0}
                %
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    project.estimatedAnnualCollection
                      ? Math.min(
                          100,
                          (project.harvestedWater /
                            project.estimatedAnnualCollection) *
                            100
                        )
                      : 0
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="details-card upload-card">
        <h2>System Design</h2>

        {project.designFile && (
          <div className="existing-file">
            <p>Design file uploaded successfully.</p>

            <a
              href={`http://localhost:4000${project.designFile}`}
              target="_blank"
              rel="noreferrer"
              className="secondary-btn"
            >
              View Design
            </a>
          </div>
        )}

        <form onSubmit={handleFileUpload}>
          <div className="form-group">
            <label htmlFor="design">
              Upload System Design
            </label>

            <input
              id="design"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <small>
              Accepted formats: PDF, JPG, JPEG and PNG
            </small>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload Design"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjectDetails;