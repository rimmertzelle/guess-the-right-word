import { Router } from 'express';
import { getIndex } from '../controllers/indexController.js';
import { getWords} from '../controllers/wordsController.js';
import { getLearningIndex} from '../controllers/learningController.js';

const router = Router();

// all routes
router.get('/', getIndex);
router.get('/words', getWords);
router.get('/learning', getLearningIndex);

export default router;
