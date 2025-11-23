const db = require('../config/database');

// Mostra a página EJS com o formulário
exports.getQuizForm = (req, res) => {
    try {
        res.render('criar_quiz');
    } catch (error) {
        console.error('Erro ao renderizar formulário de quiz:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Salva o quiz no banco
exports.postQuiz = async (req, res) => {
    try {
        const { pergunta, url_imagem, resposta_correta } = req.body;

        if (!pergunta || !resposta_correta) {
            return res.status(400).send('Pergunta e resposta correta são obrigatórias.');
        }

        await db.query(
            'INSERT INTO quizzes (pergunta, url_imagem, resposta_correta) VALUES (?, ?, ?)',
            [pergunta, url_imagem, resposta_correta]
        );

        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao salvar quiz:', error);
        res.status(500).send('Erro ao salvar o quiz.');
    }
};

// Busca o quiz completo para jogar (todos as perguntas)
exports.getQuizParaJogar = async (req, res) => {
    try {
        // Agora buscamos TODOS os quizzes, não apenas um por ID
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

        const respostaCorreta = rows[0].resposta_correta;

        if (resposta === respostaCorreta) {
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