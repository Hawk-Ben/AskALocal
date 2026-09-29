import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    uname: {type: String},
    pword: {type: String} // Hash with bcript
})

export default mongoose.model('User', userSchema)