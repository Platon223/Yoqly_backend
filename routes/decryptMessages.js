import express from 'express'
const router = express.Router();
import { handleDecryption } from '../controllers/decryptMessages.js';

router.get('/', handleDecryption);

export default router