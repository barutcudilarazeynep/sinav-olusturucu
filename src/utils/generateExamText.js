import { shuffleArray } from './shuffle';

/**
 * Generates a printable exam text with shuffled questions and options.
 * Returns the exam text and the new answer key.
 * 
 * @param {Array} questions - Array of question objects
 * @param {string} variant - 'A' or 'B'
 * @param {string} title - Optional title for the exam
 * @returns {string} - Formatted exam text
 */
export const generateExamText = (questions, variant = 'A', title = 'SINAV') => {
    if (!questions || questions.length === 0) {
        return 'Soru bulunamadı.';
    }

    // Shuffle questions
    const shuffledQuestions = shuffleArray([...questions]);

    let output = `${title} - ${variant} KİTAPÇIĞI\n`;
    output += '='.repeat(40) + '\n\n';

    const answerKey = [];
    const optionLabels = ['A', 'B', 'C', 'D', 'E'];

    shuffledQuestions.forEach((q, qIndex) => {
        const questionNumber = qIndex + 1;

        // Shuffle options for this question
        const shuffledOptions = shuffleArray([...q.options]);

        // Find the new position of the correct answer
        let correctNewLabel = '?';
        shuffledOptions.forEach((opt, optIndex) => {
            if (opt.isCorrect) {
                correctNewLabel = optionLabels[optIndex];
            }
        });

        answerKey.push(`${questionNumber}-${correctNewLabel}`);

        // Write question
        output += `${questionNumber}. ${q.text}\n`;

        // Write options
        shuffledOptions.forEach((opt, optIndex) => {
            output += `${optionLabels[optIndex]}) ${opt.text}\n`;
        });

        output += '\n';
    });

    // Add answer key at the bottom
    output += '='.repeat(40) + '\n';
    output += 'CEVAP ANAHTARI\n';
    output += answerKey.join(', ') + '\n';

    return output;
};

/**
 * Triggers a download of a text file
 * @param {string} content - Text content
 * @param {string} filename - Filename to save as
 */
export const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
