const express = require("express");

const {
  getUsers,
  getAllProjects,
  verifyProject,
  deleteUser,
  getAnalytics
} = require("../controllers/adminController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getUsers);

router.get("/projects", getAllProjects);

router.patch("/projects/:id/verify", verifyProject);

router.delete("/users/:id", deleteUser);

router.get("/analytics", getAnalytics);

module.exports = router;