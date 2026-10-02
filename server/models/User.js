import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    uname: {type: String},
    pword: {type: String}, // Hash with bcript
    bio: {type: String, default: ''},
    homeLocation: {type: String, default: ''},
    birthday: {type: Date, default: null} //For age verification, if needed in the future
}, {toJson: {virtuals: true}, toObject: {virtuals: true}})

userSchema.virtual('eventsAttending', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'attendees'
})

userSchema.virtual('eventsHosting', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'host'
})

export default mongoose.model('User', userSchema)