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
// Adicionei 'checarSeLogado' aqui também
router.get('/jogos', checarSeLogado, async (req, res) => {
    const quizzes = await quizController.getAllQuizzes(req, res, true);
    const memoryGames = await memoryGameController.getAllGames();
    const newGames = await gamesController.getAllNewGames(); // Busca os novos jogos

    res.render('lista_jogos', { quizzes, memoryGames, newGames });
});

// --- Rotas para Jogar ---
router.get('/jogo/memoria/:id', checarSeLogado, memoryGameController.getGame);
router.get('/jogo/quiz/:id', checarSeLogado, quizController.getQuizParaJogar);
router.post('/jogo/quiz/checar', checarSeLogado, quizController.postChecarResposta);

router.get('/jogo/digitacao/:id', checarSeLogado, gamesController.getTypingGame);
router.get('/jogo/palavras/:id', checarSeLogado, gamesController.getScrambleGame);
router.get('/jogo/forca/:id', checarSeLogado, gamesController.getHangmanGame);
router.get('/jogo/matematica/:id', checarSeLogado, gamesController.getMathGame);

// --- Rotas de Admin para Criar Jogos (Protegidas) ---
// TODO: Adicionar middleware para verificar se é admin de fato, se necessário
router.get('/admin/digitacao/novo', checarSeAdmin, gamesController.getCreateTyping);
router.post('/admin/digitacao/novo', checarSeAdmin, gamesController.postCreateTyping);
router.get('/admin/digitacao/:id/editar', checarSeAdmin, gamesController.getEditTyping);
router.post('/admin/digitacao/:id/editar', checarSeAdmin, gamesController.postEditTyping);

router.get('/admin/palavras/novo', checarSeAdmin, gamesController.getCreateScramble);
router.post('/admin/palavras/novo', checarSeAdmin, gamesController.postCreateScramble);
router.get('/admin/palavras/:id/editar', checarSeAdmin, gamesController.getEditScramble);
router.post('/admin/palavras/:id/editar', checarSeAdmin, gamesController.postEditScramble);

router.get('/admin/forca/novo', checarSeAdmin, gamesController.getCreateHangman);
router.post('/admin/forca/novo', checarSeAdmin, gamesController.postCreateHangman);
router.get('/admin/forca/:id/editar', checarSeAdmin, gamesController.getEditHangman);
router.post('/admin/forca/:id/editar', checarSeAdmin, gamesController.postEditHangman);

router.get('/admin/matematica/novo', checarSeAdmin, gamesController.getCreateMath);
router.post('/admin/matematica/novo', checarSeAdmin, gamesController.postCreateMath);
router.get('/admin/matematica/:id/editar', checarSeAdmin, gamesController.getEditMath);
router.post('/admin/matematica/:id/editar', checarSeAdmin, gamesController.postEditMath);

// --- Rotas de Quiz ---
router.get('/admin/quiz/novo', checarSeAdmin, quizController.getCreateQuiz);
router.post('/admin/quiz/novo', checarSeAdmin, quizController.postCreateQuiz);
router.get('/admin/quiz/:id/editar', checarSeAdmin, quizController.getEditQuiz);
router.post('/admin/quiz/:id/editar', checarSeAdmin, quizController.postEditQuiz);

module.exports = router;