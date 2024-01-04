import express from 'express';
import { addFeedback, getFeedbacks } from '../controllers/feedbackController';

const router = express.Router();

router.post('/add-feedback', addFeedback);
router.get('/get-feedback', getFeedbacks);



export default router;