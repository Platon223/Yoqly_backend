import express from 'express'
const router = express.Router();
import { loginCont } from '../controllers/auth.js';

router.post('/', loginCont);


export default router