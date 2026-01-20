import React from 'react';

const QuestionCard = ({ question, index, total, selectedOption, onSelect }) => {
    return (
        <div className="question-card">
            <div className="question-header">
                <span className="question-number">Soru {index + 1}/{total}</span>
                <h3 className="question-text">{question.text}</h3>
            </div>

            <div className="options-grid">
                {question.options.map((option, idx) => {
                    const isSelected = selectedOption === option.id;
                    return (
                        <button
                            key={option.id}
                            className={`option-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelect(option.id)}
                        >
                            <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option.text}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionCard;
