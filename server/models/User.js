import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    uname: {type: String},
    pword: {type: String}, // Hash with bcript
    bio: {type: String, default: ''},
    eventsAttending: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: []}],
    eventsHosting: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: []}],
    homeLocation: {type: String, default: ''},
    birthday: {type: Date, default: null} //For age verification, if needed in the future
})

export default mongoose.model('User', userSchema)