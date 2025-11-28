const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checarSeAdmin } = require('../middleware/authMiddleware');
const memoryGameController = require('../controllers/memoryGameController');

// --- Rotas Públicas ---
// (Apenas Login e Logout são públicos)
const { body } = require('express-validator');

// --- Rotas Públicas ---
// (Apenas Login e Logout são públicos)
router.get('/login', authController.getLoginPage);
router.post('/login', [
    body('usuario').notEmpty().withMessage('Usuário é obrigatório'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
], authController.postLogin);
router.get('/logout', authController.getLogout);

// --- Rotas de Admin ---
// (TUDO DAQUI PARA BAIXO EXIGE SER ADMIN)

router.get('/admin', checarSeAdmin, authController.getAdminPage);

// ✅ CADASTRO PROTEGIDO: Só o professor pode acessar
router.get('/cadastro', checarSeAdmin, authController.getRegisterPage);
router.post('/cadastro', checarSeAdmin, [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('idade').isInt({ min: 5, max: 100 }).withMessage('Idade deve ser um número válido'),
    body('turma').notEmpty().withMessage('Turma é obrigatória'),
    body('usuario').isLength({ min: 4 }).withMessage('Usuário deve ter no mínimo 4 caracteres'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], authController.postRegister);

// Gestão de Alunos
router.get('/admin/alunos', checarSeAdmin, authController.getAlunosPage);
router.get('/admin/aluno/:id/editar', checarSeAdmin, authController.getEditarAlunoPage);
router.post('/admin/aluno/:id/editar', checarSeAdmin, authController.postEditarAluno);
router.post('/admin/aluno/:id/excluir', checarSeAdmin, authController.postExcluirAluno);

// Gestão de Professores
router.get('/admin/cadastro-professor', checarSeAdmin, authController.getRegisterProfessorPage);
router.post('/admin/cadastro-professor', checarSeAdmin, [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('usuario').isLength({ min: 4 }).withMessage('Usuário deve ter no mínimo 4 caracteres'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], authController.postRegisterProfessor);

router.get('/admin/professores', checarSeAdmin, authController.getProfessoresPage);
router.get('/admin/professor/:id/editar', checarSeAdmin, authController.getEditarProfessorPage);
router.post('/admin/professor/:id/editar', checarSeAdmin, authController.postEditarProfessor);
router.post('/admin/professor/:id/excluir', checarSeAdmin, authController.postExcluirProfessor);



module.exports = router;