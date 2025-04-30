import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const addCourse = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/courses',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      fetchCourses();
    } catch (err) {
      setError('Failed to add course');
    }
  };

  const addQuestion = () => {
    if (!currentQuestion || options.some((opt) => !opt)) {
      setError('Please fill all question fields');
      return;
    }
    setQuestions([
      ...questions,
      { questionText: currentQuestion, options, correctAnswerIndex: Number(correctAnswerIndex) },
    ]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    setError('');
  };

  const addQuiz = async () => {
    if (!selectedCourseId || !quizTitle || questions.length === 0) {
      setError('Please fill all quiz fields');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/admin/courses/${selectedCourseId}/quizzes`,
        { title: quizTitle, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizTitle('');
      setQuestions([]);
      setSelectedCourseId('');
      setError('');
    } catch (err) {
      setError('Failed to add quiz');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Course</h2>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
        />
        <input
          type="text"
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mr-2"
        />
        <button
          onClick={addCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Course
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Quiz</h2>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-2"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
        />
        <div className="mb-4">
          <input
            type="text"
            placeholder="Question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
          />
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                setOptions(newOptions);
              }}
              className="border border-gray-300 rounded px-3 py-2 mb-2 w-full"
            />
          ))}
          <label className="block mb-2">
            Correct Answer Index (0-3):
            <input
              type="number"
              min="0"
              max="3"
              value={correctAnswerIndex}
              onChange={(e) => setCorrectAnswerIndex(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 ml-2 w-16"
            />
          </label>
          <button
            onClick={addQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Question
          </button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Questions Added:</h3>
          <ul className="list-disc list-inside">
            {questions.map((q, idx) => (
              <li key={idx}>{q.questionText}</li>
            ))}
          </ul>
        </div>
      </section>

      {error && <p className="text-red-600 mb-4">{error}</p>}
    </div>
  );
}

export default AdminDashboard;
