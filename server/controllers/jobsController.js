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
    const { title, description, category, locationName, coordinates, price, currency } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const jobData = {
      title,
      description,
      category,
      locationName,
      price,
      currency: currency || 'ZAR',
      poster: req.user.userId
    };

    // Add geolocation if provided
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      jobData.location = {
        type: 'Point',
        coordinates: coordinates // [lng, lat]
      };
    }

    const job = new Job(jobData);
    await job.save();
    await job.populate('poster', 'fullName email');

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const acceptJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not available' });
    }

    job.worker = req.user.userId;
    job.status = 'accepted';
    job.updatedAt = Date.now();
    await job.save();

    await job.populate(['poster', 'worker'], 'fullName email');

    res.json(job);
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getNearbyJobs = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 15000 } = req.query; // maxDistance in meters (default 15km)

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const jobs = await Job.find({
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'open',
      active: true
    })
    .populate('poster', 'fullName email')
    .limit(100);

    res.json(jobs);
  } catch (error) {
    console.error('Get nearby jobs error:', error);
    res.status(500).json({ error: 'Server error' });
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
