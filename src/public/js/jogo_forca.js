// ✅ LINHA NOVA: Pega as palavras que definimos no HTML
const words = window.words;

// Pick a random word from the list
let targetWord = '';
let hint = '';
let guessedLetters = [];
let lives = 6;

function initGame() {
    // Verificação de segurança
    if (!words || !words.length) {
        console.warn('Nenhuma palavra encontrada para o jogo da forca.');
        // Opcional: Mostrar erro na tela se não houver palavras
        const container = document.getElementById('word-slots');
        if (container) container.innerHTML = 'Erro: Nenhuma palavra carregada.';
        return;
    }

    const randomWordObj = words[Math.floor(Math.random() * words.length)];

    // Tratamento para garantir que seja string e maiúscula
    if (randomWordObj && randomWordObj.word) {
        targetWord = randomWordObj.word.toUpperCase();
        hint = randomWordObj.hint;
    } else {
        console.error("Palavra inválida no banco de dados");
        return;
    }

    guessedLetters = [];
    lives = 6;

    const hintEl = document.getElementById('hint-display');
    const livesEl = document.getElementById('lives');

    if (hintEl) hintEl.innerText = hint || 'Sem dica';
    if (livesEl) livesEl.innerText = lives;

    renderSlots();
    renderKeyboard();
}

function renderSlots() {
    const slotsContainer = document.getElementById('word-slots');
    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';

    targetWord.split('').forEach(letter => {
        const slot = document.createElement('div');
        slot.className = 'slot';

        // Se for um espaço (palavra composta), já mostra vazio ou traço
        if (letter === ' ') {
            slot.className = 'slot space'; // Adicione CSS para .space se quiser sumir com a borda
            slot.innerText = '-';
            // Adicionamos o espaço aos adivinhados para não travar a vitória
            if (!guessedLetters.includes(' ')) guessedLetters.push(' ');
        }
        else if (guessedLetters.includes(letter)) {
            slot.innerText = letter;
        } else {
            slot.innerText = '';
        }
        slotsContainer.appendChild(slot);
    });

    checkWin();
}

function renderKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    if (!keyboardContainer) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    keyboardContainer.innerHTML = '';

    alphabet.forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        key.innerText = letter;

        if (guessedLetters.includes(letter)) {
            key.disabled = true;
            if (targetWord.includes(letter)) {
                key.classList.add('correct');
            } else {
                key.classList.add('wrong');
            }
        }

        key.onclick = () => handleGuess(letter);
        keyboardContainer.appendChild(key);
    });
}

function handleGuess(letter) {
    if (lives <= 0) return;

    guessedLetters.push(letter);

    if (!targetWord.includes(letter)) {
        lives--;
        const livesEl = document.getElementById('lives');
        if (livesEl) livesEl.innerText = lives;
    }

    renderSlots();
    renderKeyboard();
    checkLoss();
}

function showGameOver(won) {
    const gameArea = document.getElementById('game-area');
    const gameOverScreen = document.getElementById('game-over-screen');
    const title = document.getElementById('game-over-title');
    const message = document.getElementById('game-over-message');
    const scoreEl = document.getElementById('game-over-score');

    if (gameArea) gameArea.style.display = 'none';
    if (gameOverScreen) gameOverScreen.style.display = 'block';

    if (won) {
        const score = 100 + (lives * 10);
        title.innerText = '🎉 Parabéns!';
        message.innerText = 'Você acertou a palavra: ' + targetWord;
        scoreEl.innerText = 'Sua Pontuação: ' + score;
        title.style.color = 'green';
    } else {
        title.innerText = '😢 Game Over';
        message.innerText = 'A palavra era: ' + targetWord;
        scoreEl.innerText = 'Sua Pontuação: 0';
        title.style.color = 'red';
    }
}

function checkWin() {
    // Verifica se todas as letras (ignorando espaços se houver) foram adivinhadas
    const isWin = targetWord.split('').every(l => guessedLetters.includes(l));

    if (isWin) {
        setTimeout(() => {
            showGameOver(true);
        }, 500);
    }
}

function checkLoss() {
    if (lives <= 0) {
        setTimeout(() => {
            showGameOver(false);
        }, 500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initGame);