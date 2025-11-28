// Pegamos os elementos do DOM
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const resultArea = document.getElementById('resultArea');

// --- PROTEÇÃO CONTRA ERROS ---
// O "if" abaixo garante que o código do jogo só rode se a tela de jogo existir.
// Se estiver na tela de seleção, ele ignora tudo e não dá erro.
if (quoteDisplayElement && quoteInputElement) {

    // Pegamos o texto que foi definido no HTML (variável global)
    // Se window.textoDoJogo for undefined, usamos uma string vazia para não quebrar
    const textToType = window.textoDoJogo || "";

    let startTime;
    let timerInterval;
    let isPlaying = false;
    let isFinished = false;

    // 1. Configuração inicial do texto na tela
    quoteDisplayElement.innerHTML = '';
    textToType.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });

    // 2. Evento de Digitação
    quoteInputElement.addEventListener('input', () => {
        if (isFinished) return;

        // Inicia o timer na primeira letra digitada
        if (!isPlaying) {
            isPlaying = true;
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
        }

        const arrayQuote = quoteDisplayElement.querySelectorAll('span');
        const arrayValue = quoteInputElement.value.split('');

        let correct = true;
        let correctChars = 0;

        // Verifica cada letra
        arrayQuote.forEach((characterSpan, index) => {
            const character = arrayValue[index];

            if (character == null) {
                characterSpan.classList.remove('correct-char');
                characterSpan.classList.remove('incorrect-char');
                correct = false;
            } else if (character === characterSpan.innerText) {
                characterSpan.classList.add('correct-char');
                characterSpan.classList.remove('incorrect-char');
                correctChars++;
            } else {
                characterSpan.classList.remove('correct-char');
                characterSpan.classList.add('incorrect-char');
                correct = false;
            }
        });

        // Calcula Precisão
        const accuracy = arrayValue.length > 0
            ? Math.round((correctChars / arrayValue.length) * 100)
            : 100;

        if (accuracyElement) accuracyElement.innerText = accuracy + '%';

        // Verifica Vitória (Se tudo está correto e o tamanho é igual)
        if (correct && arrayValue.length === arrayQuote.length) {
            finishGame();
        }
    });

    function updateTimer() {
        const timeInSeconds = Math.floor((new Date() - startTime) / 1000);

        if (timerElement) {
            timerElement.innerText = timeInSeconds + 's';
        }

        // Calcula WPM (Palavras por minuto)
        // Regra padrão: 5 caracteres = 1 palavra
        const words = quoteInputElement.value.length / 5;
        const minutes = timeInSeconds / 60;
        const wpm = minutes > 0 ? Math.floor(words / minutes) : 0;

        if (wpmElement) wpmElement.innerText = wpm;
    }

    function finishGame() {
        isFinished = true;
        clearInterval(timerInterval);
        quoteInputElement.disabled = true;

        if (resultArea) {
            resultArea.style.display = 'block';
            const finalStats = document.getElementById('final-stats');
            if (finalStats) {
                finalStats.innerText = `WPM: ${wpmElement.innerText} | Precisão: ${accuracyElement.innerText} | Tempo: ${timerElement.innerText}`;
            }
        }
    }
}