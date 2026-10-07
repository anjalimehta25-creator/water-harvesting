import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.get("/auth/profile");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || ""
        });
      } catch (error) {
        setError(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const data = await api.put("/auth/profile", {
        name: formData.name,
        phone: formData.phone,
        location: formData.location
      });

      if (setUser && data.user) {
        setUser(data.user);
      }

      setMessage("Profile updated successfully");
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and account
            details.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            {(
              formData.name ||
              user?.name ||
              "U"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2>{formData.name || "User"}</h2>

          <p>{formData.email}</p>

          <span className="profile-role">
            {user?.role || "user"}
          </span>
        </div>

        <div className="form-card">
          <h2>Personal Information</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                minLength="2"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
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
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;