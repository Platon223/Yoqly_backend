import express from 'express'
const router = express.Router();
import { getUser } from '../controllers/getUser.js';

router.get('/', getUser)

export default router