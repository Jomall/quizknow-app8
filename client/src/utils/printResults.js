// Utility function to generate printable HTML for quiz results
export const generateQuizResultsHtml = (quiz, submission, student) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes} min`;
  };

  const getAnswerText = (question, answer) => {
    if (!answer || answer.answer === null || answer.answer === undefined) {
      return 'Not answered';
    }

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        if (question.options && question.options[answer.answer]) {
          return question.options[answer.answer].text;
        }
        return answer.answer.toString();

      case 'select-all':
        if (Array.isArray(answer.answer)) {
          return answer.answer.map(index => {
            if (question.options && question.options[index]) {
              return question.options[index].text;
            }
            return index.toString();
          }).join(', ');
        }
        return answer.answer.toString();

      default:
        return answer.answer.toString();
    }
  };

  const getCorrectAnswerText = (question) => {
    switch (question.type) {
      case 'multiple-choice':
        if (question.options) {
          const correctIndex = question.options.findIndex(opt => opt.isCorrect);
          return correctIndex >= 0 ? question.options[correctIndex].text : 'N/A';
        }
        break;

      case 'true-false':
        return question.correctAnswer ? 'True' : 'False';

      case 'select-all':
        if (question.options) {
          const correctOptions = question.options
            .filter(opt => opt.isCorrect)
            .map(opt => opt.text);
          return correctOptions.join(', ');
        }
        break;

      default:
        return question.correctAnswer || 'N/A';
    }
    return 'N/A';
  };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quiz Results - ${quiz.title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #1976d2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header h1 {
          color: #1976d2;
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .student-info {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .score-summary {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          text-align: center;
        }

        .score-box {
          background-color: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          flex: 1;
          margin: 0 10px;
        }

        .score-box.correct {
          background-color: #e8f5e8;
          border: 2px solid #4caf50;
        }

        .score-box.incorrect {
          background-color: #ffebee;
          border: 2px solid #f44336;
        }

        .score-number {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
        }

        .question {
          margin-bottom: 25px;
          page-break-inside: avoid;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .question-number {
          background-color: #1976d2;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }

        .question-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .status-correct {
          background-color: #4caf50;
          color: white;
        }

        .status-incorrect {
          background-color: #f44336;
          color: white;
        }

        .status-not-answered {
          background-color: #ff9800;
          color: white;
        }

        .question-text {
          font-size: 16px;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .answer-section {
          margin-top: 15px;
        }

        .answer-label {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .your-answer {
          background-color: #fff3e0;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .correct-answer {
          background-color: #e8f5e8;
          padding: 10px;
          border-radius: 4px;
        }

        .points {
          text-align: right;
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }

        @media print {
          body { margin: 0; padding: 15px; }
          .question { page-break-inside: avoid; }
          .score-box { break-inside: avoid; }
        }

        @page {
          margin: 0.5in;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${quiz.title}</h1>
        <div style="font-size: 14px; color: #666; margin: 5px 0;">
          <strong>Description:</strong> ${quiz.description || 'No description'}
        </div>
      </div>

      <div class="student-info">
        <strong>Student:</strong> ${student?.profile?.firstName || student?.username || 'Unknown'}<br>
        <strong>Submitted:</strong> ${formatDate(submission.submittedAt)}<br>
        <strong>Time Spent:</strong> ${formatTime(submission.timeSpent)}
      </div>

      <div class="score-summary">
        <div class="score-box correct">
          <div>Score</div>
          <div class="score-number">${submission.percentage}%</div>
          <div>${submission.score}/${submission.maxScore} points</div>
        </div>
        <div class="score-box">
          <div>Questions</div>
          <div class="score-number">${quiz.questions?.length || 0}</div>
          <div>Total</div>
        </div>
        <div class="score-box">
          <div>Status</div>
          <div class="score-number">${submission.percentage >= (quiz.settings?.passingScore || 70) ? 'PASS' : 'FAIL'}</div>
          <div>Passing: ${(quiz.settings?.passingScore || 70)}%</div>
        </div>
      </div>
  `;

  if (quiz.questions && quiz.questions.length > 0) {
    quiz.questions.forEach((question, index) => {
      const answer = submission.answers?.find(a => a.questionId === question._id.toString());
      const isCorrect = answer?.isCorrect || false;
      const hasAnswer = answer && answer.answer !== null && answer.answer !== undefined;

      const statusClass = hasAnswer
        ? (isCorrect ? 'status-correct' : 'status-incorrect')
        : 'status-not-answered';

      const statusText = hasAnswer
        ? (isCorrect ? 'Correct' : 'Incorrect')
        : 'Not Answered';

      html += `
        <div class="question">
          <div class="question-header">
            <div class="question-number">Question ${index + 1}</div>
            <div class="question-status ${statusClass}">${statusText}</div>
          </div>

          <div class="question-text">${question.question}</div>

          <div class="answer-section">
            <div class="answer-label">Your Answer:</div>
            <div class="your-answer">
              ${getAnswerText(question, answer)}
            </div>

            ${!isCorrect && hasAnswer ? `
              <div class="answer-label">Correct Answer:</div>
              <div class="correct-answer">
                ${getCorrectAnswerText(question)}
              </div>
            ` : ''}
          </div>

          <div class="points">
            Points: ${answer?.pointsEarned || 0} / ${question.points || 1}
          </div>
        </div>
      `;
    });
  }

  html += `
      <div class="footer">
        <div>Generated on ${formatDate(new Date())}</div>
        <div>QuizKnow Quiz Results</div>
      </div>
    </body>
    </html>
  `;

  return html;
};

// Function to trigger print
export const printQuizResults = (quiz, submission, student) => {
  const html = generateQuizResultsHtml(quiz, submission, student);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
