import { useState } from "react";

function Estimation() {
  const [formData, setFormData] = useState({
    catchmentArea: "",
    annualRainfall: "",
    runoffCoefficient: "0.8"
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateEstimation = (e) => {
    e.preventDefault();

    const area = Number(formData.catchmentArea);
    const rainfall = Number(formData.annualRainfall);
    const coefficient = Number(formData.runoffCoefficient);

    if (!area || !rainfall || !coefficient) {
      setResult(null);
      return;
    }

    const annualCollection = area * rainfall * coefficient;
    const monthlyCollection = annualCollection / 12;
    const recommendedStorage = monthlyCollection * 0.5;

    setResult({
      annualCollection,
      monthlyCollection,
      recommendedStorage
    });
  };

  const resetForm = () => {
    setFormData({
      catchmentArea: "",
      annualRainfall: "",
      runoffCoefficient: "0.8"
    });

    setResult(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Water Collection Estimation</h1>
          <p>
            Estimate the amount of rainwater your
            catchment area can collect.
          </p>
        </div>
      </div>

      <div className="estimation-container">
        <div className="form-card">
          <h2>Enter Catchment Details</h2>

          <form onSubmit={calculateEstimation}>
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
                placeholder="Example: 100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="annualRainfall">
                Average Annual Rainfall (mm)
              </label>

              <input
                id="annualRainfall"
                name="annualRainfall"
                type="number"
                min="1"
                step="0.01"
                value={formData.annualRainfall}
                onChange={handleChange}
                placeholder="Example: 900"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="runoffCoefficient">
                Runoff Coefficient
              </label>

              <select
                id="runoffCoefficient"
                name="runoffCoefficient"
                value={formData.runoffCoefficient}
                onChange={handleChange}
              >
                <option value="0.9">
                  0.9 - Metal/Concrete Roof
                </option>
                <option value="0.8">
                  0.8 - Good Roof Surface
                </option>
                <option value="0.75">
                  0.75 - Average Roof Surface
                </option>
                <option value="0.6">
                  0.6 - Rough Surface
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Calculate
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="result-card">
          <h2>Estimation Results</h2>

          {!result ? (
            <div className="empty-state">
              <p>
                Enter your catchment details and click
                Calculate to see the estimated water
                collection.
              </p>
            </div>
          ) : (
            <div className="results">
              <div className="result-item">
                <span>Annual Water Collection</span>
                <strong>
                  {result.annualCollection.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2
                    }
                  )}{" "}
                  L
                </strong>
              </div>

              <div className="result-item">
                <span>Average Monthly Collection</span>
                <strong>
                  {result.monthlyCollection.toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2
                    }
                  )}{" "}
                  L
                </strong>
              </div>

              <div className="result-item">
                <span>Recommended Storage Capacity</span>
                <strong>
                  {result.recommendedStorage.toLocaleString(
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
                  Water Collection = Catchment Area ×
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
      </div>
    </div>
  );
}

export default Estimation;