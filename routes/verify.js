import express from 'express'
const router = express.Router()
import { verifyMFA } from '../controllers/verify.js'

router.post('/', verifyMFA)

export default router