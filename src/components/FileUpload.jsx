import React, { useRef, useState } from 'react';
import { parseQuestionsFromText } from '../utils/parseQuestions';
import { useQuestions } from '../context/QuestionContext';

const FileUpload = () => {
    const { addQuestions } = useQuestions();
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/plain') {
            setStatus('Lütfen sadece .txt dosyası yükleyin.');
            return;
        }

        try {
            const text = await file.text();
            const parsedQuestions = parseQuestionsFromText(text);

            if (parsedQuestions.length === 0) {
                setStatus('Dosyadan soru okunamadı. Formatı kontrol edin.');
                return;
            }

            addQuestions(parsedQuestions);
            setStatus(`Başarıyla ${parsedQuestions.length} soru eklendi!`);

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            console.error(err);
            setStatus('Dosya okunurken hata oluştu.');
        }
    };

    return (
        <div className="file-upload-section">
            <h3>Toplu Soru Yükle</h3>
            <p className="hint">Format: 1. Soru ... a) Şık ... Cevap: a</p>

            <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt"
                    hidden
                />
                <span className="upload-icon">📂</span>
                <span>Dosya Seç veya Sürükle (.txt)</span>
            </div>

            {status && <div className="upload-status">{status}</div>}
        </div>
    );
};

export default FileUpload;
