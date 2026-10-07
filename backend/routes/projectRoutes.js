const express = require("express");

const {
  createProject,
  getProjects,
  getCommunityProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateHarvestedWater,
  uploadProjectDesign,
  getDashboardStats
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/dashboard/stats", protect, getDashboardStats);

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/community", protect, getCommunityProjects);

router.get("/:id", protect, getProjectById);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

router.patch("/:id/harvested-water", protect, updateHarvestedWater);

router.post(
  "/:id/design",
  protect,
  upload.single("design"),
  uploadProjectDesign
);

module.exports = router;