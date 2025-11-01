import express from 'express'
const router = express.Router();
import { loginCont } from '../controllers/auth.js';

router.post('/:step', (req, res) => {
    loginCont(req, res, req.params.step)
});


export default router