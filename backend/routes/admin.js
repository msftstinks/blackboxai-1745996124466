const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Middleware to verify admin
router.use(verifyToken);
router.use(verifyAdmin);

// Add a course
router.post('/courses', async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = new Course({
      title,
      description,
      createdBy: req.user.userId,
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name email');
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a quiz to a course
router.post('/courses/:courseId/quizzes', async (req, res) => {
  const { courseId } = req.params;
  const { title, questions } = req.body;
  try {
    const quiz = new Quiz({
      course: courseId,
      title,
      questions,
    });
    await quiz.save();

    // Add quiz to course
    const course = await Course.findById(courseId);
    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quizzes for a course
router.get('/courses/:courseId/quizzes', async (req, res) => {
  const { courseId } = req.params;
  try {
    const quizzes = await Quiz.find({ course: courseId });
    res.status(200).json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
