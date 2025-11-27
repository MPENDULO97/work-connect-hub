import express from 'express';
import * as projectsController from '../controllers/projectsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', projectsController.listProjects);
router.get('/:id', projectsController.getProject);
router.post('/', auth, projectsController.createProject);
router.put('/:id', auth, projectsController.updateProject);
router.delete('/:id', auth, projectsController.deleteProject);

export default router;
