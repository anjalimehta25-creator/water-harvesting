const Project = require("../models/project");

const createProject = async (req, res) => {
  try {
    const {
      title,
      location,
      catchmentArea,
      annualRainfall,
      runoffCoefficient,
      storageCapacity,
      installationDate,
      description,
      harvestedWater
    } = req.body;

    if (
      !title ||
      !location ||
      !catchmentArea ||
      !annualRainfall
    ) {
      return res.status(400).json({
        message: "Title, location, catchment area and annual rainfall are required"
      });
    }

    const coefficient = Number(runoffCoefficient) || 0.8;

    const estimatedAnnualCollection =
      Number(catchmentArea) *
      Number(annualRainfall) *
      coefficient;

    const project = await Project.create({
      user: req.user.id,
      title,
      location,
      catchmentArea: Number(catchmentArea),
      annualRainfall: Number(annualRainfall),
      runoffCoefficient: coefficient,
      storageCapacity: Number(storageCapacity) || 0,
      installationDate,
      description,
      harvestedWater: Number(harvestedWater) || 0,
      estimatedAnnualCollection
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project"
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects"
    });
  }
};

const getCommunityProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "verified"
    })
      .populate("user", "name location")
      .sort({
        createdAt: -1
      });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch community projects"
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("user", "name email location");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project"
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const {
      title,
      location,
      catchmentArea,
      annualRainfall,
      runoffCoefficient,
      storageCapacity,
      installationDate,
      description,
      harvestedWater
    } = req.body;

    project.title = title ?? project.title;
    project.location = location ?? project.location;
    project.catchmentArea =
      catchmentArea ?? project.catchmentArea;
    project.annualRainfall =
      annualRainfall ?? project.annualRainfall;
    project.runoffCoefficient =
      runoffCoefficient ?? project.runoffCoefficient;
    project.storageCapacity =
      storageCapacity ?? project.storageCapacity;
    project.installationDate =
      installationDate ?? project.installationDate;
    project.description =
      description ?? project.description;
    project.harvestedWater =
      harvestedWater ?? project.harvestedWater;

    project.estimatedAnnualCollection =
      Number(project.catchmentArea) *
      Number(project.annualRainfall) *
      Number(project.runoffCoefficient);

    await project.save();

    res.json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project"
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project"
    });
  }
};

const updateHarvestedWater = async (req, res) => {
  try {
    const { harvestedWater } = req.body;

    if (
      harvestedWater === undefined ||
      Number(harvestedWater) < 0
    ) {
      return res.status(400).json({
        message: "Valid harvested water value is required"
      });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        harvestedWater: Number(harvestedWater)
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json({
      message: "Harvested water updated successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update harvested water"
    });
  }
};

const uploadProjectDesign = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        designFile: `/uploads/${req.file.filename}`
      },
      {
        new: true
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json({
      message: "Design uploaded successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed"
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id
    });

    const totalProjects = projects.length;

    const totalEstimatedWater = projects.reduce(
      (sum, project) =>
        sum + Number(project.estimatedAnnualCollection || 0),
      0
    );

    const totalHarvestedWater = projects.reduce(
      (sum, project) =>
        sum + Number(project.harvestedWater || 0),
      0
    );

    const verifiedProjects = projects.filter(
      project => project.verified
    ).length;

    res.json({
      totalProjects,
      totalEstimatedWater,
      totalHarvestedWater,
      verifiedProjects
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics"
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getCommunityProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateHarvestedWater,
  uploadProjectDesign,
  getDashboardStats
};