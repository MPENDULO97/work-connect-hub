import Project from '../models/Project.js';

export const listProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open';
    }

    const projects = await Project.find(filter)
      .populate('clientId', 'fullName email')
      .populate('freelancerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'fullName email')
      .populate('freelancerId', 'fullName email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      clientId: req.user.userId
    });

    await project.save();
    await project.populate('clientId', 'fullName email');

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, clientId: req.user.userId });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    Object.assign(project, req.body);
    project.updatedAt = Date.now();
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      clientId: req.user.userId,
      status: 'draft'
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found or cannot be deleted' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
