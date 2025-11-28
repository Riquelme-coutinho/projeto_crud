// ✅ LINHA NOVA: Pega as palavras que definimos no HTML (window.words)
const words = window.words;

let currentWordIndex = 0;
let currentWordObj = null;
let mistakes = 0;

function initGame() {
    // Verificação de segurança: se não tiver palavras, avisa no console
    if (!words || !words.length) {
        console.warn('Nenhuma palavra encontrada ou erro ao carregar do banco.');
        const container = document.querySelector('.scramble-container');
        if (container) container.innerHTML = '<p>Erro: Nenhuma palavra carregada.</p>';
        return;
    }

    // Se acabou as palavras, mostra a mensagem de vitória
    if (currentWordIndex >= words.length) {
        const maxScore = words.length * 10;
        const finalScore = Math.max(0, maxScore - (mistakes * 2));

        document.querySelector('.scramble-container').innerHTML = `
            <h3>🎉 Parabéns!</h3>
            <p>Você completou todas as palavras.</p>
            <p><strong>Pontuação Final: ${finalScore} / ${maxScore}</strong></p>
            <p><small>(Erros: ${mistakes})</small></p>
            <button onclick="location.reload()" class="btn btn-primary">Jogar Novamente</button>
        `;
        return;
    }

    currentWordObj = words[currentWordIndex];

    // Atualiza a tela
    const hintElement = document.getElementById('hint-display');
    const scrambleElement = document.getElementById('scramble-display');

    if (hintElement) hintElement.innerText = currentWordObj.hint || 'Sem dica';
    if (scrambleElement) scrambleElement.innerText = scrambleWord(currentWordObj.word);

    document.getElementById('guess-input').value = '';
    document.getElementById('feedback').innerText = '';
    document.getElementById('guess-input').focus();
}

function scrambleWord(word) {
    if (!word) return '';
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('').toUpperCase(); // Garante que mostre em maiúsculo
}

function checkAnswer() {
    const input = document.getElementById('guess-input');
    const guess = input.value.toUpperCase().trim();
    const feedback = document.getElementById('feedback');

    // Compara tudo em maiúsculo para evitar erros de digitação
    if (guess === currentWordObj.word.toUpperCase()) {
        feedback.innerText = 'Correto! Próxima palavra...';
        feedback.className = 'feedback success';
        setTimeout(() => {
            currentWordIndex++;
            initGame();
        }, 1500);
    } else {
        feedback.innerText = 'Tente novamente!';
        feedback.className = 'feedback error';
        input.value = '';
        input.focus();
        mistakes++;
    }
}

// Permite apertar Enter para enviar
const inputField = document.getElementById('guess-input');
if (inputField) {
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

// Inicia o jogo quando a tela carregar
document.addEventListener('DOMContentLoaded', initGame);