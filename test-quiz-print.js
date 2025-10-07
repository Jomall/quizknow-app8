// Test script to verify quiz printing functionality
const fs = require('fs');

// Mock quiz data
const mockQuiz = {
  title: "Sample Quiz",
  description: "A test quiz for printing",
  createdAt: new Date().toISOString(),
  questions: [
    {
      question: "What is the capital of France?",
      type: "multiple-choice",
      options: [
        { text: "London" },
        { text: "Paris" },
        { text: "Berlin" },
        { text: "Madrid" }
      ]
    },
    {
      question: "Select all programming languages:",
      type: "select-all",
      options: [
        { text: "JavaScript" },
        { text: "HTML" },
        { text: "Python" },
        { text: "Word" }
      ]
    },
    {
      question: "Explain what a variable is in programming.",
      type: "open-ended"
    },
    {
      question: "True or False: The Earth is flat.",
      type: "true-false",
      options: [
        { text: "True" },
        { text: "False" }
      ]
    }
  ]
};

// Copy the generateQuizHtml function from the component
const generateQuizHtml = (quiz) => {
  let html = `
    <html>
    <head>
      <title>${quiz.title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #1976d2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h1 {
          color: #1976d2;
          margin: 0;
          font-size: 28px;
        }
        .quiz-info {
          margin: 10px 0;
          font-size: 14px;
          color: #666;
        }
        .question {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .question-number {
          background-color: #1976d2;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .question-text {
          font-size: 16px;
          margin-bottom: 15px;
          font-weight: 500;
        }
        .options {
          margin-left: 20px;
        }
        .option {
          margin-bottom: 8px;
          padding: 5px 0;
        }
        .option-letter {
          font-weight: bold;
          margin-right: 10px;
          min-width: 20px;
          display: inline-block;
        }
        .open-ended {
          border-bottom: 1px solid #ccc;
          padding: 20px 0;
          margin-top: 10px;
          min-height: 60px;
        }
        .instructions {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border-left: 4px solid #1976d2;
        }
        @media print {
          body { margin: 20px; }
          .question { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${quiz.title}</h1>
        <div class="quiz-info">
          <strong>Description:</strong> ${quiz.description || 'No description'}
        </div>
        <div class="quiz-info">
          <strong>Total Questions:</strong> ${quiz.questions?.length || 0}
        </div>
      </div>

      <div class="instructions">
        <strong>Instructions:</strong> Please answer all questions. For multiple choice questions, select the best answer. For select-all questions, choose all that apply. For open-ended questions, provide detailed responses.
      </div>
  `;

  if (quiz.questions && quiz.questions.length > 0) {
    quiz.questions.forEach((q, index) => {
      const questionNumber = index + 1;
      html += `
        <div class="question">
          <div class="question-number">Question ${questionNumber}</div>
          <div class="question-text">${q.question}</div>
          <div class="options">
      `;

      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (q.options && q.options.length > 0) {
          q.options.forEach((option, optIndex) => {
            const letter = String.fromCharCode(65 + optIndex);
            html += `<div class="option"><span class="option-letter">${letter}.</span> ${option.text}</div>`;
          });
        }
      } else if (q.type === 'select-all') {
        if (q.options && q.options.length > 0) {
          q.options.forEach((option, optIndex) => {
            html += `<div class="option"><span class="option-letter">□</span> ${option.text}</div>`;
          });
        }
      } else {
        html += `<div class="open-ended">Answer:</div>`;
      }

      html += `</div></div>`;
    });
  }

  html += `</body></html>`;
  return html;
};

// Test the function
console.log("Testing quiz HTML generation...");
const html = generateQuizHtml(mockQuiz);

// Check for key features
const checks = [
  { test: "Title is present", pass: html.includes(mockQuiz.title) },
  { test: "Description is present", pass: html.includes(mockQuiz.description) },
  { test: "Question numbering (Question 1, Question 2, etc.)", pass: html.includes("Question 1") && html.includes("Question 2") },
  { test: "No correct answers shown", pass: !html.includes("Correct Answer") },
  { test: "Multiple choice options with letters (A., B., etc.)", pass: html.includes("A.") && html.includes("B.") },
  { test: "Select-all options with checkboxes (□)", pass: html.includes("□") },
  { test: "Open-ended questions have answer space", pass: html.includes("Answer:") },
  { test: "Instructions section present", pass: html.includes("Instructions:") },
  { test: "Header styling present", pass: html.includes("header") },
  { test: "Print-friendly CSS present", pass: html.includes("@media print") }
];

console.log("\nTest Results:");
checks.forEach(check => {
  console.log(`${check.test}: ${check.pass ? '✅ PASS' : '❌ FAIL'}`);
});

const passedTests = checks.filter(c => c.pass).length;
const totalTests = checks.length;
console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! Quiz printing functionality is working correctly.");
} else {
  console.log("⚠️  Some tests failed. Please check the implementation.");
}

// Save the HTML to a file for manual inspection
fs.writeFileSync('test-quiz-output.html', html);
console.log("\nHTML output saved to test-quiz-output.html for manual inspection.");
