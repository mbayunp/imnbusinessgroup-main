import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({ message: err.message || 'Gagal membuat proyek' });
  }
};

