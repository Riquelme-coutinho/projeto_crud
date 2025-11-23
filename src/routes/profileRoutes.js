const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { checarSeLogado } = require('../middleware/authMiddleware');
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
router.get('/admin/digitacao/novo', checarSeLogado, gamesController.getCreateTyping);
router.post('/admin/digitacao/novo', checarSeLogado, gamesController.postCreateTyping);

router.get('/admin/palavras/novo', checarSeLogado, gamesController.getCreateScramble);
router.post('/admin/palavras/novo', checarSeLogado, gamesController.postCreateScramble);

router.get('/admin/forca/novo', checarSeLogado, gamesController.getCreateHangman);
router.post('/admin/forca/novo', checarSeLogado, gamesController.postCreateHangman);

router.get('/admin/matematica/novo', checarSeLogado, gamesController.getCreateMath);
router.post('/admin/matematica/novo', checarSeLogado, gamesController.postCreateMath);

module.exports = router;