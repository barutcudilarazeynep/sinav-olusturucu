import React, { useState } from 'react';
import { useQuestions } from '../context/QuestionContext';
import FileUpload from './FileUpload';
import { generateExamText, downloadTextFile } from '../utils/generateExamText';

const Dashboard = ({ onStartExam }) => {
    const { questions, addQuestion, removeQuestion } = useQuestions();

    const [newQ, setNewQ] = useState({ text: '', options: [] });
    const [optText, setOptText] = useState('');
    const [correctId, setCorrectId] = useState(null);

    const handleAddOption = () => {
        if (!optText) return;
        const newOption = { id: Date.now().toString(), text: optText, isCorrect: false };
        setNewQ({ ...newQ, options: [...newQ.options, newOption] });
        setOptText('');
    };

    const handleSetCorrect = (id) => {
        setCorrectId(id);
        const updated = newQ.options.map(o => ({ ...o, isCorrect: o.id === id }));
        setNewQ({ ...newQ, options: updated });
    };

    const saveQuestion = () => {
        if (!newQ.text || newQ.options.length < 2 || !correctId) {
            alert("Lütfen soru metni, en az 2 şık ve doğru cevabı belirtin.");
            return;
        }
        addQuestion(newQ);
        setNewQ({ text: '', options: [] });
        setCorrectId(null);
    };

    const handleDownloadA = () => {
        if (questions.length === 0) {
            alert("Önce soru eklemelisiniz.");
            return;
        }
        const text = generateExamText(questions, 'A', 'SINAV');
        downloadTextFile(text, 'sinav_A_kitapcigi.txt');
    };

    const handleDownloadB = () => {
        if (questions.length === 0) {
            alert("Önce soru eklemelisiniz.");
            return;
        }
        const text = generateExamText(questions, 'B', 'SINAV');
        downloadTextFile(text, 'sinav_B_kitapcigi.txt');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Sınav Oluşturucu</h1>
                <p className="subtitle">Soru yükleyin, karıştırılmış kitapçıkları indirin</p>
                <div className="actions">
                    <button className="primary-btn" onClick={handleDownloadA}>📥 A Kitapçığını İndir</button>
                    <button className="primary-btn" onClick={handleDownloadB}>📥 B Kitapçığını İndir</button>
                </div>
            </header>

            <div className="content-grid">
                <div className="form-section">
                    <FileUpload />
                    <div className="divider">VEYA</div>
                    <h2>Manuel Soru Ekle</h2>
                    <div className="input-group">
                        <label>Soru Metni</label>
                        <textarea
                            value={newQ.text}
                            onChange={e => setNewQ({ ...newQ, text: e.target.value })}
                            placeholder="Sorunuzu buraya yazın..."
                        />
                    </div>

                    <div className="options-section">
                        <div className="input-group row">
                            <input
                                type="text"
                                value={optText}
                                onChange={e => setOptText(e.target.value)}
                                placeholder="Şık metni..."
                            />
                            <button onClick={handleAddOption} className="small-btn">+ Ekle</button>
                        </div>

                        <ul className="options-preview">
                            {newQ.options.map((opt, idx) => (
                                <li key={opt.id} className={opt.isCorrect ? 'correct' : ''} onClick={() => handleSetCorrect(opt.id)}>
                                    <span>{String.fromCharCode(65 + idx)}. {opt.text}</span>
                                    {opt.isCorrect && <span className="badge">Doğru Cevap</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="save-btn" onClick={saveQuestion}>Soruyu Kaydet</button>
                </div>

                <div className="list-section">
                    <h2>Soru Listesi ({questions.length})</h2>
                    <div className="question-list">
                        {questions.map((q, i) => (
                            <div key={q.id} className="list-item">
                                <p><strong>{i + 1}.</strong> {q.text}</p>
                                <button className="delete-btn" onClick={() => removeQuestion(q.id)}>Sil</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
