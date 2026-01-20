/**
 * Fisher-Yates (aka Knuth) Shuffle
 * Randomly shuffles an array in place.
 * @param {Array} array
 * @returns {Array}
 */
export const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

/**
 * Shuffles questions and their options for Exam generation.
 * @param {Array} questions - Array of question objects
 * @param {boolean} shuffleOptions - Whether to shuffle options within questions
 * @returns {Array} - New shuffled array of questions
 */
export const generateExam = (questions, shuffleOptions = true) => {
    // 1. Shuffle the order of questions
    const shuffledQuestions = shuffleArray(questions);

    // 2. Map through and shuffle options if needed
    return shuffledQuestions.map((q) => {
        if (!shuffleOptions) return q;

        // Create detailed options if they are simple strings, 
        // but assuming structure { id, text, isCorrect } or similar.
        // Adapting to simple string array if needed, but object preferred.
        // Let's assume options is an array of objects for better tracking.

        const shuffledOptions = shuffleArray(q.options);
        return { ...q, options: shuffledOptions };
    });
};
