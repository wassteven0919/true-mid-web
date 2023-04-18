import {Router} from 'express';
import {signIn, signOut} from './handlers.js';

const router = Router();
router.post('/in/', signIn);
router.post('/out/', signOut);
export default router;
