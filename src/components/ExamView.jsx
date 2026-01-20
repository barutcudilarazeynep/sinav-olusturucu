import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { useQuestions } from '../context/QuestionContext';

const ExamView = ({ variant, onBack }) => {
    const { examA, examB } = useQuestions();
    const questions = variant === 'A' ? examA : examB;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [finished, setFinished] = useState(false);

    if (!questions || questions.length === 0) {
        return (
            <div className="empty-state">
                <h2>Sınav Oluşturulmadı</h2>
                <p>Lütfen yönetici panelinden soru ekleyip "Sınavları Karıştır" butonuna basın.</p>
                <button onClick={onBack}>Geri Dön</button>
            </div>
        );
    }

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: optionId });
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach(q => {
            const selected = answers[q.id];
            const correct = q.options.find(o => o.isCorrect)?.id;
            if (selected === correct) score++;
        });
        return score;
    };

    if (finished) {
        const score = calculateScore();
        return (
            <div className="result-screen">
                <h1>Sınav Tamamlandı</h1>
                <div className="score-card">
                    <p>Doğru Sayısı: <strong>{score}</strong> / {questions.length}</p>
                </div>
                <button className="primary-btn" onClick={onBack}>Yönetici Paneline Dön</button>
            </div>
        );
    }

    return (
        <div className="exam-container">
            <header className="exam-header">
                <h2>{variant} Kitapçığı</h2>
                <div className="timer">Kalan Süre: --:--</div>
            </header>

            <div className="active-question-area">
                <QuestionCard
                    question={questions[currentIndex]}
                    index={currentIndex}
                    total={questions.length}
                    selectedOption={answers[questions[currentIndex].id]}
                    onSelect={handleSelect}
                />
            </div>

            <footer className="exam-footer">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(c => c - 1)}
                >
                    Önceki
                </button>

                <div className="progress-dots">
                    {questions.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${idx === currentIndex ? 'active' : ''} ${answers[questions[idx].id] ? 'answered' : ''}`}
                        />
                    ))}
                </div>

                {currentIndex === questions.length - 1 ? (
                    <button className="finish-btn" onClick={() => setFinished(true)}>Sınavı Bitir</button>
                ) : (
                    <button onClick={() => setCurrentIndex(c => c + 1)}>Sonraki</button>
                )}
            </footer>
        </div>
    );
};

export default ExamView;
