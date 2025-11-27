import Proposal from '../models/Proposal.js';

export const listProposals = async (req, res) => {
  try {
    const { projectId, freelancerId } = req.query;
    const filter = {};

    if (projectId) filter.projectId = projectId;
    if (freelancerId) filter.freelancerId = freelancerId;

    const proposals = await Proposal.find(filter)
      .populate('projectId')
      .populate('freelancerId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    console.error('List proposals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProposal = async (req, res) => {
  try {
    const proposal = new Proposal({
      ...req.body,
      freelancerId: req.user.userId
    });

    await proposal.save();
    await proposal.populate('projectId');
    await proposal.populate('freelancerId', 'fullName email');

    res.status(201).json(proposal);
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(400).json({ error: 'Invalid data or duplicate proposal' });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ 
      _id: req.params.id, 
      freelancerId: req.user.userId 
    });
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    Object.assign(proposal, req.body);
    proposal.updatedAt = Date.now();
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    console.error('Update proposal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
