import {Router} from 'express';
import {getMessage, postMessage, deleteMessage} from './handlers.js';

const router = Router();
router.get('/', getMessage);
router.post('/', postMessage);
router.post('/delete', deleteMessage);
export default router;
