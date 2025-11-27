import express from 'express';
import * as jobsController from '../controllers/jobsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', jobsController.listJobs);
router.get('/nearby', jobsController.getNearbyJobs);
router.get('/:id', jobsController.getJob);
router.post('/', auth, jobsController.createJob);
router.post('/:id/accept', auth, jobsController.acceptJob);
router.put('/:id', auth, jobsController.updateJob);
router.delete('/:id', auth, jobsController.deleteJob);

export default router;
