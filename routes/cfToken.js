import express from 'express'
const router = express.Router();
import {csrfToken} from '../controllers/cfToken.js'

router.get('/', csrfToken);

export default router