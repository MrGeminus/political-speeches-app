import evaluationController from '../controllers/evaluationController';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('', evaluationController);

export default router;