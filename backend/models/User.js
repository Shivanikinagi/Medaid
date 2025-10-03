import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  language: {
    type: String,
    default: 'English'
  },
  past_history: {
    type: Map,
    of: String,
    default: {}
  },
  records: [{
    date: {
      type: Date,
      default: Date.now
    },
    current_symptoms: String,
    report_data: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    triage_result: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  }],
  report_data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;