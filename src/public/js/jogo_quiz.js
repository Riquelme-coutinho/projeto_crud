document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.quiz-step');
    const completionScreen = document.getElementById('quiz-completion');
    let currentStep = 0;
    let score = 0;

    // Show the first question
    if (steps.length > 0) {
        steps[0].style.display = 'block';
        updateButtons(0);
    } else {
        // If no questions, show completion or empty state (optional)
        completionScreen.style.display = 'block';
        completionScreen.querySelector('h2').textContent = "Nenhuma pergunta encontrada";
        completionScreen.querySelector('p').textContent = "Peça ao professor para adicionar perguntas.";
    }

    document.querySelectorAll('.quiz-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const idQuiz = this.getAttribute('data-id');
            const index = parseInt(this.getAttribute('data-index'));
            const btnCheck = this.querySelector('.btn-check');
            const resultBox = this.closest('.quiz-card').querySelector('.result-box');
            const resultText = resultBox.querySelector('.result-text');
            const btnNext = resultBox.querySelector('.btn-next');
            const btnPrev = resultBox.querySelector('.btn-prev');

            const opcaoSelecionada = this.querySelector(`input[name="quiz_${idQuiz}"]:checked`);

            if (!opcaoSelecionada) {
                alert("Por favor, selecione uma opção!");
                return;
            }

            const respostaAluno = opcaoSelecionada.value;

            // Disable button
            btnCheck.disabled = true;
            btnCheck.textContent = "Verificando...";

            fetch('/jogo/quiz/checar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_quiz: idQuiz, resposta: respostaAluno })
            })
                .then(response => response.json())
                .then(data => {
                    resultBox.classList.remove('hidden');

                    // Hide the check button
                    btnCheck.style.display = 'none';

                    if (data.correto) {
                        resultBox.className = 'result-box result-success';
                        resultText.innerHTML = "🎉 " + data.mensagem;
                        score++; // Increment score
                    } else {
                        resultBox.className = 'result-box result-error';
                        resultText.innerHTML = "❌ " + data.mensagem;
                    }

                    // Show next button
                    btnNext.style.display = 'inline-block';

                    // If it's the last question, change button text
                    if (index === steps.length - 1) {
                        btnNext.textContent = "Finalizar Quiz 🏁";
                    }

                    // Show prev button if not first question
                    if (index > 0) {
                        btnPrev.style.display = 'inline-block';
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Ocorreu um erro ao verificar a resposta.");
                    btnCheck.disabled = false;
                    btnCheck.textContent = "Conferir Resposta";
                });
        });
    });

    // Handle Next Button Clicks
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', function () {
            const currentCard = this.closest('.quiz-step');

            // Hide current
            currentCard.style.display = 'none';

            // Increment step
            currentStep++;

            if (currentStep < steps.length) {
                // Show next
                steps[currentStep].style.display = 'block';
                updateButtons(currentStep);
            } else {
                // Show completion
                completionScreen.style.display = 'block';
                const scoreDisplay = completionScreen.querySelector('p');
                if (scoreDisplay) {
                    scoreDisplay.innerHTML = `Você completou o Quiz Educativo.<br><strong>Sua Pontuação: ${score} de ${steps.length}</strong>`;
                }
            }
        });
    });

    // Handle Prev Button Clicks
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', function () {
            const currentCard = this.closest('.quiz-step');

            // Hide current
            currentCard.style.display = 'none';

            // Decrement step
            currentStep--;

            if (currentStep >= 0) {
                // Show prev
                steps[currentStep].style.display = 'block';
                // Reset state of previous question to allow re-answering? 
                // Or just show it as answered? 
                // For now, let's just show it. The form state is preserved by the browser usually.
                // If we want to reset, we'd need to clear the result box and show the check button again.
                // But usually "Back" just lets you see/change. 
                // Given the logic hides the check button, if they go back, they see the result.
                // If they want to change, they can't because the check button is gone.
                // Let's keep it simple: Back just views previous.
            }
        });
    });

    function updateButtons(index) {
        // This function could be used to manage global button states if needed
        // Currently logic is handled within event listeners
    }
});
