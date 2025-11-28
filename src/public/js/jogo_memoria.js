const gameBoard = document.getElementById('memory-game');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const winMessage = document.getElementById('win-message');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;
let matches = 0;

function initGame() {
    // Check if cardsData is defined (it should be defined in the EJS view)
    if (typeof cardsData === 'undefined' || !cardsData.length) {
        console.warn('Nenhuma carta encontrada para iniciar o jogo.');
        return;
    }

    // Duplicate and shuffle
    const gameCards = [...cardsData, ...cardsData];
    gameCards.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = '';
    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.framework = card.name;

        cardElement.innerHTML = `
            <div class="front-face">${card.icon}</div>
            <div class="back-face">?</div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    resetBoard();
    moves = 0;
    seconds = 0;
    matches = 0;
    movesDisplay.innerText = moves;
    timerDisplay.innerText = '00:00';
    winMessage.classList.add('hidden');
    clearInterval(timer);
    gameStarted = false;
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.innerText = `${mins}:${secs}`;
        }, 1000);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    startTimer();

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    moves++;
    movesDisplay.innerText = moves;

    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matches++;
    if (matches === cardsData.length) {
        clearInterval(timer);
        setTimeout(() => {
            const score = Math.max(0, 1000 - (moves * 10) - (seconds * 2));
            const scoreEl = document.getElementById('final-score');
            if (scoreEl) scoreEl.innerText = `Sua Pontuação: ${score}`;
            winMessage.classList.remove('hidden');
        }, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function restartGame() {
    initGame();
}

// Initialize the game when the script loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
