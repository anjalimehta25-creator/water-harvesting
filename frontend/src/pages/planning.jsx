import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Planning() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    catchmentArea: "",
    annualRainfall: "",
    runoffCoefficient: "0.8",
    storageCapacity: "",
    installationDate: "",
    description: ""
  });

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateEstimate = () => {
    const area = Number(formData.catchmentArea);
    const rainfall = Number(formData.annualRainfall);
    const coefficient = Number(formData.runoffCoefficient);

    if (!area || !rainfall) {
      setEstimate(null);
      return;
    }

    const annualCollection = area * rainfall * coefficient;
    const monthlyCollection = annualCollection / 12;
    const recommendedStorage = monthlyCollection * 0.5;

    setEstimate({
      annualCollection,
      monthlyCollection,
      recommendedStorage
    });

    if (!formData.storageCapacity) {
      setFormData((prev) => ({
        ...prev,
        storageCapacity: Math.round(recommendedStorage)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await api.post("/projects", {
        ...formData,
        catchmentArea: Number(formData.catchmentArea),
        annualRainfall: Number(formData.annualRainfall),
        runoffCoefficient: Number(
          formData.runoffCoefficient
        ),
        storageCapacity: Number(
          formData.storageCapacity || 0
        )
      });

      setSuccess("Rainwater harvesting project created successfully.");

      setTimeout(() => {
        navigate(`/projects/${data.project._id}`);
      }, 1000);
    } catch (error) {
      setError(
        error.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rainwater Harvesting Planning</h1>
          <p>
            Plan your rainwater harvesting system and
            estimate its collection potential.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="planning-container">
        <div className="form-card">
          <h2>Project Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                Project Name
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Home Rainwater System"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Bengaluru, Karnataka"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="catchmentArea">
                  Catchment Area (m²)
                </label>

                <input
                  id="catchmentArea"
                  name="catchmentArea"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.catchmentArea}
                  onChange={handleChange}
                  onBlur={calculateEstimate}
                  placeholder="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="annualRainfall">
                  Annual Rainfall (mm)
                </label>

                <input
                  id="annualRainfall"
                  name="annualRainfall"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.annualRainfall}
                  onChange={handleChange}
                  onBlur={calculateEstimate}
                  placeholder="900"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="runoffCoefficient">
                Roof Surface
              </label>

              <select
                id="runoffCoefficient"
                name="runoffCoefficient"
                value={formData.runoffCoefficient}
                onChange={handleChange}
                onBlur={calculateEstimate}
              >
                <option value="0.9">
                  Metal / Concrete Roof - 0.90
                </option>

                <option value="0.8">
                  Good Roof Surface - 0.80
                </option>

                <option value="0.75">
                  Average Roof Surface - 0.75
                </option>

                <option value="0.6">
                  Rough Surface - 0.60
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="storageCapacity">
                Storage Capacity (L)
              </label>

              <input
                id="storageCapacity"
                name="storageCapacity"
                type="number"
                min="0"
                value={formData.storageCapacity}
                onChange={handleChange}
                placeholder="Recommended capacity"
              />
            </div>

            <div className="form-group">
              <label htmlFor="installationDate">
                Installation Date
              </label>

              <input
                id="installationDate"
                name="installationDate"
                type="date"
                value={formData.installationDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Project Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your rainwater harvesting system"
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Project..."
                : "Create Project"}
            </button>
          </form>
        </div>

        <div className="planning-result">
          <div className="result-card">
            <h2>Planning Estimate</h2>

            {!estimate ? (
              <div className="empty-state">
                <p>
                  Enter your catchment area and annual
                  rainfall to see the estimated collection.
                </p>
              </div>
            ) : (
              <div className="results">
                <div className="result-item">
                  <span>Annual Collection</span>

                  <strong>
                    {estimate.annualCollection.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2
                      }
                    )}{" "}
                    L
                  </strong>
                </div>

                <div className="result-item">
                  <span>Monthly Average</span>

                  <strong>
                    {estimate.monthlyCollection.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2
                      }
                    )}{" "}
                    L
                  </strong>
                </div>

                <div className="result-item">
                  <span>Recommended Storage</span>

                  <strong>
                    {estimate.recommendedStorage.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2
                      }
                    )}{" "}
                    L
                  </strong>
                </div>

                <div className="calculation-box">
                  <h3>Calculation</h3>

                  <p>
                    Annual Collection = Catchment Area ×
                    Rainfall × Runoff Coefficient
                  </p>

                  <p>
                    {formData.catchmentArea} ×{" "}
                    {formData.annualRainfall} ×{" "}
                    {formData.runoffCoefficient}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="info-card">
            <h2>Planning Tips</h2>

            <ul>
              <li>
                Measure the complete rooftop catchment area.
              </li>

              <li>
                Use local average annual rainfall data.
              </li>

              <li>
                Choose a suitable runoff coefficient based
                on the roof surface.
              </li>

              <li>
                Select a storage tank according to the
                expected water collection.
              </li>

              <li>
                Keep the system clean and maintain gutters
                regularly.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planning;