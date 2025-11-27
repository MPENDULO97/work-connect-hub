import express from 'express';
import * as proposalsController from '../controllers/proposalsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, proposalsController.listProposals);
router.post('/', auth, proposalsController.createProposal);
router.put('/:id', auth, proposalsController.updateProposal);

export default router;
