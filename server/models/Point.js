import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: "Point",
    required: true
  }
});

export default mongoose.model('Point', pointSchema)