import Job from '../models/Job.js';

export const listJobs = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = { active: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const jobs = await Job.find(filter)
      .populate('poster', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(500);

    res.json(jobs);
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('poster', 'fullName email');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, category, location, price, currency } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const job = new Job({
      title,
      description,
      category,
      location,
      price,
      currency: currency || 'ZAR',
      poster: req.user.userId
    });

    await job.save();
    await job.populate('poster', 'fullName email');

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, poster: req.user.userId });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    Object.assign(job, req.body);
    job.updatedAt = Date.now();
    await job.save();

    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, poster: req.user.userId });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.active = false;
    await job.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
