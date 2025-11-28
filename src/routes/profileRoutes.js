const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { checarSeLogado, checarSeAdmin } = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');
const memoryGameController = require('../controllers/memoryGameController');
const gamesController = require('../controllers/gamesController');

// --- Rotas de Perfil ---
router.get('/perfil', checarSeLogado, profileController.getProfilePage);
router.post('/perfil/atualizar', checarSeLogado, profileController.updateProfile);
router.post('/perfil/avatar', checarSeLogado, profileController.updateAvatar);

// --- Rotas de Opções (Dashboard do Aluno) ---
router.get('/aluno/opcoes', checarSeLogado, profileController.getStudentOptionsPage);

// --- Rotas de Jogo (Agora Protegidas) ---
router.get('/jogos', checarSeLogado, async (req, res) => {
    const quizzes = await quizController.getAllQuizzes(req, res, true);
    const memoryGames = await memoryGameController.getAllGames();
    const newGames = await gamesController.getAllNewGames(); // Busca os novos jogos

    res.render('lista_jogos', { quizzes, memoryGames, newGames });
});

// --- Rotas para Jogar ---
// --- Rotas para Jogar ---
router.get('/jogo/memoria/:id', checarSeLogado, memoryGameController.getGame); // Aceita ID (ex: 'menu') para compatibilidade com a view
router.get('/jogo/quiz', checarSeLogado, quizController.getJogoQuiz);
router.post('/jogo/quiz/checar', checarSeLogado, quizController.postChecarResposta);

// Jogos Refatorados
router.get('/jogo/digitacao/:id', checarSeLogado, gamesController.getTypingGame);
// Palavras e Forca não precisam de ID pois usam o banco todo, mas mantemos :id na rota para compatibilidade com lista_jogos
// O controller vai ignorar o ID para Palavras/Forca, ou podemos passar um ID dummy
router.get('/jogo/palavras/:id', checarSeLogado, gamesController.getScrambleGame);
router.get('/jogo/forca/:id', checarSeLogado, gamesController.getHangmanGame);
router.get('/jogo/matematica/:id', checarSeLogado, gamesController.getMathGame);

// --- Rotas de Admin (Listagem e Edição de Itens Fixos) ---

// Digitação
router.get('/admin/digitacao', checarSeAdmin, gamesController.getTypingList);
router.get('/admin/digitacao/criar', checarSeAdmin, gamesController.getCreateTyping); // Nova rota
router.post('/admin/digitacao/criar', checarSeAdmin, gamesController.postCreateTyping); // Nova rota
router.get('/admin/digitacao/:id/editar', checarSeAdmin, gamesController.getEditTyping);
router.post('/admin/digitacao/:id/editar', checarSeAdmin, gamesController.postEditTyping);
router.post('/admin/digitacao/:id/excluir', checarSeAdmin, gamesController.postDeleteTyping); // Nova rota

// Palavras Embaralhadas
router.get('/admin/palavras', checarSeAdmin, gamesController.getScrambleList);
router.get('/admin/palavras/criar', checarSeAdmin, gamesController.getCreateScramble); // Nova rota
router.post('/admin/palavras/criar', checarSeAdmin, gamesController.postCreateScramble); // Nova rota
router.get('/admin/palavras/:id/editar', checarSeAdmin, gamesController.getEditScramble);
router.post('/admin/palavras/:id/editar', checarSeAdmin, gamesController.postEditScramble);
router.post('/admin/palavras/:id/excluir', checarSeAdmin, gamesController.postDeleteScramble); // Nova rota

// Forca
router.get('/admin/forca', checarSeAdmin, gamesController.getHangmanList);
router.get('/admin/forca/criar', checarSeAdmin, gamesController.getCreateHangman); // Nova rota
router.post('/admin/forca/criar', checarSeAdmin, gamesController.postCreateHangman); // Nova rota
router.get('/admin/forca/:id/editar', checarSeAdmin, gamesController.getEditHangman);
router.post('/admin/forca/:id/editar', checarSeAdmin, gamesController.postEditHangman);
router.post('/admin/forca/:id/excluir', checarSeAdmin, gamesController.postDeleteHangman); // Nova rota

// Matemática
router.get('/admin/matematica', checarSeAdmin, gamesController.getMathList);
router.get('/admin/matematica/criar', checarSeAdmin, gamesController.getCreateMath); // Nova rota
router.post('/admin/matematica/criar', checarSeAdmin, gamesController.postCreateMath); // Nova rota
router.get('/admin/matematica/:id/editar', checarSeAdmin, gamesController.getEditMath);
router.post('/admin/matematica/:id/editar', checarSeAdmin, gamesController.postEditMath);
router.post('/admin/matematica/:id/excluir', checarSeAdmin, gamesController.postDeleteMath); // Nova rota

// Quiz (Já estava no modelo fixo)
router.get('/admin/quiz/editar', checarSeAdmin, quizController.getEditQuizList);
router.get('/admin/quiz/criar', checarSeAdmin, quizController.getCreateQuiz); // Nova rota
router.post('/admin/quiz/criar', checarSeAdmin, quizController.postCreateQuiz); // Nova rota
router.get('/admin/quiz/:id/editar', checarSeAdmin, quizController.getEditQuizSingle);
router.post('/admin/quiz/:id/editar', checarSeAdmin, quizController.postEditQuiz);
router.post('/admin/quiz/:id/excluir', checarSeAdmin, quizController.postDeleteQuiz); // Nova rota

// Memória (Novo modelo fixo)
router.get('/admin/memoria', checarSeAdmin, memoryGameController.getEditList);
router.get('/admin/memoria/criar', checarSeAdmin, memoryGameController.getCreateForm); // Nova rota
router.post('/admin/memoria/criar', checarSeAdmin, memoryGameController.postCreate); // Nova rota
router.get('/admin/memoria/:id/editar', checarSeAdmin, memoryGameController.getEditForm);
router.post('/admin/memoria/:id/editar', checarSeAdmin, memoryGameController.postEdit);
router.post('/admin/memoria/:id/excluir', checarSeAdmin, memoryGameController.postDelete); // Nova rota

module.exports = router;