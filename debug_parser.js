
const parseQuestionsFromText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentQ = null;
    let currentQIndex = 0;

    const questionStartRegex = /^(?:Soru\s*)?(\d+)[\.:\)]\s+(.+)/i;
    const optionRegex = /^([a-eA-E])[\)\.]\s+(.+)/;
    const inlineAnswerRegex = /^(?:Cevap|Answer|Doğru\s*Cevap|Yanıt)\s*[:\-\s]\s*([a-eA-E])/i;
    const bulkKeyRegex = /(\d+)\s*[-:\.]\s*([a-eA-E])/g;

    for (let line of lines) {
        const answerMatch = line.match(inlineAnswerRegex);
        if (answerMatch && currentQ) {
            questions.push(currentQ);
            currentQ = null;
            continue;
        }

        const qMatch = line.match(questionStartRegex);
        if (qMatch) {
            if (currentQ) {
                questions.push(currentQ);
            }

            const qNum = parseInt(qMatch[1]);
            currentQ = {
                qNumber: qNum,
                text: qMatch[2],
                options: [],
                tempOptions: []
            };
            continue;
        }

        const optMatch = line.match(optionRegex);
        if (optMatch && currentQ) {
            const char = optMatch[1].toLowerCase();
            const optText = optMatch[2];
            const newOption = { text: optText, isCorrect: false };
            currentQ.options.push(newOption);
            currentQ.tempOptions.push({ char, id: 0 }); // simplified
            continue;
        }

        if (currentQ && currentQ.options.length === 0) {
            if (line.toUpperCase().includes("CEVAP") && line.toUpperCase().includes("ANAHTAR")) {
                continue;
            }
            currentQ.text += " " + line;
        }
    }

    if (currentQ) {
        questions.push(currentQ);
    }

    return questions;
};

const sampleText = `İŞ SAĞLIĞI VE GÜVENLİĞİ (İSG) TEMEL TESTİ
1. İş sağlığı ve güvenliğinin temel amacı aşağıdakilerden hangisidir?
A) Sadece iş kazalarını raporlamak
B) Çalışanları korumak, üretim güvenliğini ve işletme emniyetini sağlamak
C) İşçilerin daha hızlı çalışmasını sağlamak
D) Sadece yasal cezalardan kaçınmak
2. İş yerinde risk değerlendirmesi yapılırken izlenmesi gereken ilk adım nedir?
A) Kontrol tedbirlerini kararlaştırmak
B) Tehlikeleri tanımlamak
C) Riskleri analiz etmek
D) Dokümantasyon hazırlamak
3. Aşağıdakilerden hangisi bir "ergonomik" risk faktörüdür?
A) Gürültülü ortam
B) Yanıcı maddeler
C) Tekrarlayan hareketler ve yanlış duruş
D) Yüksek voltajlı elektrik hattı`;

const result = parseQuestionsFromText(sampleText);
console.log("Total Questions Parsed:", result.length);
result.forEach(q => console.log(q.qNumber, q.text));
