const User = require("../models/user");
const Project = require("../models/project");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const verifyProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        status: "verified",
        verified: true
      },
      {
        new: true,
        runValidators: true
      }
    ).populate("user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project verified successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify project" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Project.deleteMany({ user: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const verifiedProjects = await Project.countDocuments({
      verified: true
    });

    const result = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalWater: {
            $sum: "$estimatedAnnualCollection"
          }
        }
      }
    ]);

    const totalWater = result.length > 0 ? result[0].totalWater : 0;

    res.json({
      totalUsers,
      totalProjects,
      verifiedProjects,
      totalWater
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

module.exports = {
  getUsers,
  getAllProjects,
  verifyProject,
  deleteUser,
  getAnalytics
};