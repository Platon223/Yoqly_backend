import express from 'express'
const router = express.Router();
import { handleRefresh } from '../controllers/handleRefreshToken.js';


router.get('/', handleRefresh);

export default router