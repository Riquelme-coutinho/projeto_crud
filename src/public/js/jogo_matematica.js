// ✅ LINHA NOVA: Pega a configuração que definimos no HTML
const config = window.config;

// config example: { operations: ['+'], min: 1, max: 10, questions: 5 }

let currentQuestion = 1;
let score = 0;
let correctAnswer = 0;
let totalQuestions = 10;

function initGame() {
    // Verificação de segurança
    if (!config) {
        console.warn('Configuração do jogo de matemática não encontrada.');
        const container = document.querySelector('.math-container');
        if(container) container.innerHTML = '<p class="text-center">Erro: Configuração não carregada.</p>';
        return;
    }

    totalQuestions = config.questions || 10;
    
    const qTotalElement = document.getElementById('q-total');
    if(qTotalElement) qTotalElement.innerText = totalQuestions;
    
    generateQuestion();

    // Configura o ENTER para enviar a resposta (movido para cá para garantir que o elemento existe)
    const input = document.getElementById('answer-input');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
}

function generateQuestion() {
    if (currentQuestion > totalQuestions) {
        finishGame();
        return;
    }

    const qCurrent = document.getElementById('q-current');
    if(qCurrent) qCurrent.innerText = currentQuestion;

    // Garante que operations existe, senão usa padrão [+]
    const ops = config.operations && config.operations.length > 0 ? config.operations : ['+'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    const min = config.min || 1;
    const max = config.max || 10;

    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    // Avoid negative results for subtraction if desired, or division by zero
    let n1 = num1, n2 = num2;

    if (op === '-') {
        if (n1 < n2) [n1, n2] = [n2, n1]; // Swap so result is positive
    } else if (op === '/') {
        // Ensure clean division (Multiplica para garantir que a divisão seja exata)
        n1 = n2 * Math.floor(Math.random() * 5 + 1);
    }

    let displayOp = op;
    if (op === '*') displayOp = '×';
    if (op === '/') displayOp = '÷';

    const eqElement = document.getElementById('equation');
    if(eqElement) eqElement.innerText = `${n1} ${displayOp} ${n2} = ?`;

    // Calculate correct answer
    if (op === '+') correctAnswer = n1 + n2;
    if (op === '-') correctAnswer = n1 - n2;
    if (op === '*') correctAnswer = n1 * n2;
    if (op === '/') correctAnswer = n1 / n2;

    const input = document.getElementById('answer-input');
    if(input) {
        input.value = '';
        input.focus();
    }
}

function checkAnswer() {
    const input = document.getElementById('answer-input');
    if(!input) return;

    const val = parseInt(input.value);

    if (isNaN(val)) return;

    const scoreElement = document.getElementById('score');

    if (val === correctAnswer) {
        score++;
        if(scoreElement) scoreElement.innerText = score;
        input.style.borderColor = 'green';
    } else {
        input.style.borderColor = 'red';
        // Opcional: Mostrar feedback visual sem alert para ficar mais fluido
        // alert(`Errado! A resposta era ${correctAnswer}`);
    }

    // Update progress
    const pct = (currentQuestion / totalQuestions) * 100;
    const progressEl = document.getElementById('progress');
    if(progressEl) progressEl.style.width = pct + '%';

    currentQuestion++;
    setTimeout(() => {
        input.style.borderColor = '#ddd'; // Volta a cor normal
        generateQuestion();
    }, 1000);
}

function finishGame() {
    const container = document.querySelector('.math-container');
    if(container) {
        container.innerHTML = `
            <div class="text-center">
                <h3>Fim de Jogo!</h3>
                <p class="mt-3">Você acertou <strong>${score}</strong> de <strong>${totalQuestions}</strong> questões.</p>
                <button onclick="location.reload()" class="btn btn-primary mt-3">Jogar Novamente</button>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', initGame);