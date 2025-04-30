const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
