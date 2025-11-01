import mongoose from 'mongoose'

const codeSchema = new mongoose.Schema({
    id: String,
    code: String,
    user_id: String,
    expire_date: Date
})

const Codes = mongoose.model('Codes', codeSchema)

export default Codes