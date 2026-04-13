const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  hrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
