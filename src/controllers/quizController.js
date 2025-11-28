const db = require('../config/database');

// Renderiza a página do jogo de quiz
exports.getJogoQuiz = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM quizzes');

        if (rows.length === 0) {
            return res.send('Nenhum quiz encontrado! Peça ao professor para criar um.');
        }

        // Passamos 'quizzes' (array) ao invés de 'quiz' (objeto único)
        res.render('jogo_quiz', { quizzes: rows });
    } catch (error) {
        console.error('Erro ao buscar quiz:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Checa a resposta do aluno
exports.postChecarResposta = async (req, res) => {
    try {
        const { id_quiz, resposta } = req.body;

        const [rows] = await db.query('SELECT resposta_correta FROM quizzes WHERE id_quiz = ?', [id_quiz]);

        if (rows.length === 0) {
            return res.json({ correto: false, mensagem: 'Erro: Quiz não encontrado.' });
        }

        // Converte ambos para string para garantir comparação correta
        const respostaCorreta = String(rows[0].resposta_correta);
        const respostaAluno = String(resposta);

        console.log('Comparando respostas:', {
            respostaAluno,
            respostaCorreta,
            tipo_aluno: typeof respostaAluno,
            tipo_correta: typeof respostaCorreta
        });

        if (respostaAluno === respostaCorreta) {
            res.json({ correto: true, mensagem: 'Correto! Você acertou!' });
        } else {
            res.json({ correto: false, mensagem: 'Errado. Tente novamente!' });
        }
    } catch (error) {
        console.error('Erro ao checar resposta:', error);
        res.status(500).json({ correto: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Busca todos os quizzes para a lista de jogos
exports.getAllQuizzes = async (req, res, returnData = false) => {
    try {
        const [quizzes] = await db.query('SELECT * FROM quizzes');

        // If returnData is true, return the data instead of rendering
        if (returnData) {
            return quizzes;
        }

        res.render('lista_jogos', { quizzes: quizzes });
    } catch (error) {
        console.error('Erro ao buscar lista de quizzes:', error);
        if (returnData) {
            return [];
        }
        res.status(500).send('Erro interno do servidor.');
    }
};

// =============================================================================
// SISTEMA DE QUIZ - PERGUNTAS EDITÁVEIS
// =============================================================================

// Lista todas as perguntas para edição (página admin)
exports.getEditQuizList = async (req, res) => {
    try {
        const [quizzes] = await db.query('SELECT * FROM quizzes ORDER BY id_quiz');

        // Se não houver quizzes, renderiza a lista vazia ao invés de mensagem de erro
        res.render('editar_quiz_lista', { quizzes });
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Exibe formulário para editar uma pergunta específica
exports.getEditQuizSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM quizzes WHERE id_quiz = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).send('Pergunta não encontrada.');
        }

        res.render('editar_quiz_form', { quiz: rows[0], isCreate: false });
    } catch (error) {
        console.error('Erro ao buscar pergunta:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Exibe formulário para CRIAR uma nova pergunta
exports.getCreateQuiz = (req, res) => {
    res.render('editar_quiz_form', {
        quiz: { pergunta: '', url_imagem: '', resposta_correta: 'true' },
        isCreate: true
    });
};

// Salva NOVA pergunta
exports.postCreateQuiz = async (req, res) => {
    try {
        const { pergunta, url_imagem, resposta_correta } = req.body;

        if (!pergunta || !resposta_correta) {
            return res.status(400).send('Pergunta e resposta são obrigatórias.');
        }

        await db.query(
            'INSERT INTO quizzes (pergunta, url_imagem, resposta_correta) VALUES (?, ?, ?)',
            [pergunta, url_imagem || null, resposta_correta]
        );

        res.redirect('/admin/quiz/editar');
    } catch (error) {
        console.error('Erro ao criar pergunta:', error);
        res.status(500).send('Erro ao criar pergunta.');
    }
};

// Salva alterações de uma pergunta
exports.postEditQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { pergunta, url_imagem, resposta_correta } = req.body;

        // Validação
        if (!pergunta || !resposta_correta) {
            return res.status(400).send('Pergunta e resposta são obrigatórias.');
        }

        if (resposta_correta !== 'true' && resposta_correta !== 'false') {
            return res.status(400).send('Resposta deve ser "true" ou "false".');
        }

        await db.query(
            'UPDATE quizzes SET pergunta = ?, url_imagem = ?, resposta_correta = ? WHERE id_quiz = ?',
            [pergunta, url_imagem || null, resposta_correta, id]
        );

        res.redirect('/admin/quiz/editar');
    } catch (error) {
        console.error('Erro ao atualizar pergunta:', error);
        res.status(500).send('Erro ao salvar alterações.');
    }
};

// DELETAR pergunta
exports.postDeleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM quizzes WHERE id_quiz = ?', [id]);
        res.redirect('/admin/quiz/editar');
    } catch (error) {
        console.error('Erro ao deletar pergunta:', error);
        res.status(500).send('Erro ao deletar pergunta.');
    }
};