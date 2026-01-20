import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateExam } from '../utils/shuffle';

const QuestionContext = createContext();

export const useQuestions = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {
    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem('exam_questions');
        return saved ? JSON.parse(saved) : [];
    });

    const [examA, setExamA] = useState([]);
    const [examB, setExamB] = useState([]);

    useEffect(() => {
        localStorage.setItem('exam_questions', JSON.stringify(questions));
    }, [questions]);

    const addQuestion = (question) => {
        setQuestions(prev => [...prev, { ...question, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) }]);
    };

    const addQuestions = (newQuestions) => {
        const questionsWithIds = newQuestions.map((q, i) => ({
            ...q,
            id: Date.now().toString() + i + Math.random().toString(36).substr(2, 5)
        }));
        setQuestions(prev => [...prev, ...questionsWithIds]);
    };

    const removeQuestion = (id) => {
        setQuestions(prev => prev.filter((q) => q.id !== id));
    };

    const generateExams = () => {
        // Generate two independent shuffles
        // For Exam A
        const variantsA = generateExam(questions, true);
        // For Exam B - shuffle again
        const variantsB = generateExam(questions, true);

        setExamA(variantsA);
        setExamB(variantsB);
    };

    return (
        <QuestionContext.Provider
            value={{
                questions,
                addQuestion,
                addQuestions,
                removeQuestion,
                generateExams,
                examA,
                examB,
            }}
        >
            {children}
        </QuestionContext.Provider>
    );
};
