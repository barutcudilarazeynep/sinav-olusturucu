/**
 * Parses raw text content into structured Question objects.
 * Supports:
 * - Inline answers (Cevap: A)
 * - Bulk answer keys at the bottom (1-A, 2-B, etc.)
 * 
 * @param {string} text 
 * @returns {Array} Array of question objects
 */
export const parseQuestionsFromText = (text) => {
    // Normalize text: replace special characters and multiple spaces
    const normalizedText = text
        .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ') // Replace all unicode spaces with normal space
        .replace(/[""'']/g, '"') // Normalize quotes
        .replace(/–/g, '-'); // Normalize dashes

    const lines = normalizedText.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentQ = null;

    // More flexible regex patterns
    // Question: "1." or "1)" or "1:" or "Soru 1:" etc.
    const questionStartRegex = /^(?:Soru\s*)?(\d+)\s*[\.:\)]\s*(.+)/i;
    // Options: "A)" or "A." or "A-" followed by text - more flexible
    const optionRegex = /^([A-Ea-e])\s*[\)\.\-]\s*(.+)/;
    // Inline answer
    const inlineAnswerRegex = /^(?:Cevap|Answer|Doğru\s*Cevap|Yanıt)\s*[:\-\s]\s*([A-Ea-e])/i;
    // Bulk Answer Key: "1-A", "1:A", "1 A", etc.
    const bulkKeyRegex = /(\d+)\s*[-:\.\s]\s*([A-Ea-e])/g;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip header lines like "CEVAP ANAHTARI"
        if (line.toUpperCase().includes("CEVAP") && line.toUpperCase().includes("ANAHTAR")) {
            continue;
        }
        // Skip title-like lines (all caps, no question number)
        if (line === line.toUpperCase() && !questionStartRegex.test(line) && line.length > 10) {
            continue;
        }

        // Check if line is an inline answer
        const answerMatch = line.match(inlineAnswerRegex);
        if (answerMatch && currentQ) {
            const correctChar = answerMatch[1].toLowerCase();
            markCorrectOption(currentQ, correctChar);
            questions.push(currentQ);
            currentQ = null;
            continue;
        }

        // Check if line is a start of a new question
        const qMatch = line.match(questionStartRegex);
        if (qMatch) {
            // If previous question exists, push it
            if (currentQ) {
                questions.push(currentQ);
            }

            const qNum = parseInt(qMatch[1]);

            currentQ = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                qNumber: qNum,
                text: qMatch[2],
                options: [],
                tempOptions: []
            };
            continue;
        }

        // Check if line is an option
        const optMatch = line.match(optionRegex);
        if (optMatch && currentQ) {
            const char = optMatch[1].toLowerCase();
            const optText = optMatch[2];

            const newOption = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                text: optText,
                isCorrect: false
            };

            currentQ.options.push(newOption);
            currentQ.tempOptions.push({ char, id: newOption.id });
            continue;
        }

        // Append multi-line text to question if no options yet
        if (currentQ && currentQ.options.length === 0) {
            currentQ.text += " " + line;
        }
    }

    // Push the last question if exists
    if (currentQ) {
        questions.push(currentQ);
    }

    // PASS 2: Parse Answer Key (Bulk) from the entire text
    let match;
    while ((match = bulkKeyRegex.exec(normalizedText)) !== null) {
        const qNum = parseInt(match[1]);
        const answerChar = match[2].toLowerCase();

        // Find the question with this qNumber
        const question = questions.find(q => q.qNumber === qNum);
        if (question) {
            markCorrectOption(question, answerChar);
        }
    }

    // Cleanup internal properties
    return questions.map(q => {
        const { tempOptions, qNumber, ...rest } = q;
        return rest;
    });
};

// Helper to mark correct option
function markCorrectOption(question, char) {
    const correctOptIndex = question.tempOptions.findIndex(o => o.char === char);
    if (correctOptIndex !== -1) {
        // Reset others first
        question.options.forEach(o => o.isCorrect = false);
        question.options[correctOptIndex].isCorrect = true;
    }
}
