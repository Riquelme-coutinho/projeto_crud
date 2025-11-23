const db = require('../config/database');

// =============================================================================
// JOGO DE DIGITAÇÃO
// =============================================================================

// Renderiza a página para criar novo jogo de digitação
exports.getCreateTyping = (req, res) => {
    res.render('editar_jogo_digitacao', {
        game: { title: '', description: '', text_content: '' },
        action: '/admin/digitacao/novo',
        pageTitle: 'Criar Jogo de Digitação'
    });
};

// Cria o jogo de digitação no banco
exports.postCreateTyping = async (req, res) => {
    let connection;
    try {
        const { title, description, text_content } = req.body;
        const createdBy = req.session.alunoId; // Assumindo que é um professor logado

        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            'INSERT INTO typing_games (title, description, text_content, created_by) VALUES (?, ?, ?, ?)',
            [title, description, text_content, createdBy]
        );

        await connection.commit();
        res.redirect('/admin'); // Redireciona para admin para ver o jogo criado
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar jogo de digitação:', error);
        res.status(500).send('Erro ao criar jogo.');
    } finally {
        if (connection) connection.release();
    }
};

// Renderiza o jogo de digitação para jogar
exports.getTypingGame = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM typing_games WHERE id = ?', [id]);

        if (rows.length === 0) return res.status(404).send('Jogo não encontrado');

        res.render('jogo_digitacao', { game: rows[0] });
    } catch (error) {
        console.error('Erro ao buscar jogo de digitação:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.getEditTyping = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM typing_games WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Jogo não encontrado');

        res.render('editar_jogo_digitacao', {
            game: rows[0],
            action: `/admin/digitacao/${id}/editar`,
            pageTitle: 'Editar Jogo de Digitação'
        });
    } catch (error) {
        console.error('Erro ao buscar jogo para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.postEditTyping = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, text_content } = req.body;
        await db.query(
            'UPDATE typing_games SET title = ?, description = ?, text_content = ? WHERE id = ?',
            [title, description, text_content, id]
        );
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar jogo:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// =============================================================================
// JOGO DE PALAVRAS EMBARALHADAS
// =============================================================================

exports.getCreateScramble = (req, res) => {
    res.render('editar_jogo_palavras', {
        game: { title: '', description: '' },
        words: [], // Lista vazia para começar
        action: '/admin/palavras/novo',
        pageTitle: 'Criar Jogo de Palavras'
    });
};

exports.postCreateScramble = async (req, res) => {
    let connection;
    try {
        const { title, description, words, hints } = req.body;
        const createdBy = req.session.alunoId;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Criar o jogo
        const [result] = await connection.query(
            'INSERT INTO scramble_games (title, description, created_by) VALUES (?, ?, ?)',
            [title, description, createdBy]
        );
        const gameId = result.insertId;

        // 2. Criar as palavras
        // words e hints vêm como arrays do form
        if (Array.isArray(words)) {
            for (let i = 0; i < words.length; i++) {
                if (words[i].trim()) {
                    await connection.query(
                        'INSERT INTO scramble_words (game_id, word, hint) VALUES (?, ?, ?)',
                        [gameId, words[i].toUpperCase(), hints[i]]
                    );
                }
            }
        } else if (words) {
            // Caso venha apenas uma palavra (não array)
            await connection.query(
                'INSERT INTO scramble_words (game_id, word, hint) VALUES (?, ?, ?)',
                [gameId, words.toUpperCase(), hints]
            );
        }

        await connection.commit();
        res.redirect('/admin');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar jogo de palavras:', error);
        res.status(500).send('Erro ao criar jogo.');
    } finally {
        if (connection) connection.release();
    }
};

exports.getScrambleGame = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar jogo
        const [gameRows] = await db.query('SELECT * FROM scramble_games WHERE id = ?', [id]);
        if (gameRows.length === 0) return res.status(404).send('Jogo não encontrado');

        // Buscar palavras
        const [wordRows] = await db.query('SELECT * FROM scramble_words WHERE game_id = ?', [id]);

        res.render('jogo_palavras', { game: gameRows[0], words: wordRows });
    } catch (error) {
        console.error('Erro ao buscar jogo de palavras:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.getEditScramble = async (req, res) => {
    try {
        const { id } = req.params;
        const [gameRows] = await db.query('SELECT * FROM scramble_games WHERE id = ?', [id]);
        if (gameRows.length === 0) return res.status(404).send('Jogo não encontrado');

        const [wordRows] = await db.query('SELECT * FROM scramble_words WHERE game_id = ?', [id]);

        res.render('editar_jogo_palavras', {
            game: gameRows[0],
            words: wordRows,
            action: `/admin/palavras/${id}/editar`,
            pageTitle: 'Editar Jogo de Palavras'
        });
    } catch (error) {
        console.error('Erro ao buscar jogo para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.postEditScramble = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { title, description, words, hints } = req.body;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Atualiza info básica
        await connection.query('UPDATE scramble_games SET title = ?, description = ? WHERE id = ?', [title, description, id]);

        // Recria as palavras (simples: deleta tudo e insere de novo)
        await connection.query('DELETE FROM scramble_words WHERE game_id = ?', [id]);

        if (Array.isArray(words)) {
            for (let i = 0; i < words.length; i++) {
                if (words[i].trim()) {
                    await connection.query(
                        'INSERT INTO scramble_words (game_id, word, hint) VALUES (?, ?, ?)',
                        [id, words[i].toUpperCase(), hints[i]]
                    );
                }
            }
        } else if (words) {
            await connection.query(
                'INSERT INTO scramble_words (game_id, word, hint) VALUES (?, ?, ?)',
                [id, words.toUpperCase(), hints]
            );
        }

        await connection.commit();
        res.redirect('/admin');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao atualizar jogo:', error);
        res.status(500).send('Erro ao atualizar.');
    } finally {
        if (connection) connection.release();
    }
};

// =============================================================================
// JOGO DA FORCA
// =============================================================================

exports.getCreateHangman = (req, res) => {
    res.render('editar_jogo_forca', {
        game: { title: '', description: '' },
        words: [],
        action: '/admin/forca/novo',
        pageTitle: 'Criar Jogo da Forca'
    });
};

exports.postCreateHangman = async (req, res) => {
    let connection;
    try {
        const { title, description, words, hints } = req.body;
        const createdBy = req.session.alunoId;

        connection = await db.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO hangman_games (title, description, created_by) VALUES (?, ?, ?)',
            [title, description, createdBy]
        );
        const gameId = result.insertId;

        if (Array.isArray(words)) {
            for (let i = 0; i < words.length; i++) {
                if (words[i].trim()) {
                    await connection.query(
                        'INSERT INTO hangman_words (game_id, word, hint) VALUES (?, ?, ?)',
                        [gameId, words[i].toUpperCase(), hints[i]]
                    );
                }
            }
        } else if (words) {
            await connection.query(
                'INSERT INTO hangman_words (game_id, word, hint) VALUES (?, ?, ?)',
                [gameId, words.toUpperCase(), hints]
            );
        }

        await connection.commit();
        res.redirect('/admin');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar jogo da forca:', error);
        res.status(500).send('Erro ao criar jogo.');
    } finally {
        if (connection) connection.release();
    }
};

exports.getHangmanGame = async (req, res) => {
    try {
        const { id } = req.params;
        const [gameRows] = await db.query('SELECT * FROM hangman_games WHERE id = ?', [id]);
        if (gameRows.length === 0) return res.status(404).send('Jogo não encontrado');

        const [wordRows] = await db.query('SELECT * FROM hangman_words WHERE game_id = ?', [id]);

        res.render('jogo_forca', { game: gameRows[0], words: wordRows });
    } catch (error) {
        console.error('Erro ao buscar jogo da forca:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.getEditHangman = async (req, res) => {
    try {
        const { id } = req.params;
        const [gameRows] = await db.query('SELECT * FROM hangman_games WHERE id = ?', [id]);
        if (gameRows.length === 0) return res.status(404).send('Jogo não encontrado');

        const [wordRows] = await db.query('SELECT * FROM hangman_words WHERE game_id = ?', [id]);

        res.render('editar_jogo_forca', {
            game: gameRows[0],
            words: wordRows,
            action: `/admin/forca/${id}/editar`,
            pageTitle: 'Editar Jogo da Forca'
        });
    } catch (error) {
        console.error('Erro ao buscar jogo para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.postEditHangman = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { title, description, words, hints } = req.body;

        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('UPDATE hangman_games SET title = ?, description = ? WHERE id = ?', [title, description, id]);
        await connection.query('DELETE FROM hangman_words WHERE game_id = ?', [id]);

        if (Array.isArray(words)) {
            for (let i = 0; i < words.length; i++) {
                if (words[i].trim()) {
                    await connection.query(
                        'INSERT INTO hangman_words (game_id, word, hint) VALUES (?, ?, ?)',
                        [id, words[i].toUpperCase(), hints[i]]
                    );
                }
            }
        } else if (words) {
            await connection.query(
                'INSERT INTO hangman_words (game_id, word, hint) VALUES (?, ?, ?)',
                [id, words.toUpperCase(), hints]
            );
        }

        await connection.commit();
        res.redirect('/admin');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao atualizar jogo:', error);
        res.status(500).send('Erro ao atualizar.');
    } finally {
        if (connection) connection.release();
    }
};

// =============================================================================
// JOGO DE MATEMÁTICA
// =============================================================================

exports.getCreateMath = (req, res) => {
    res.render('editar_jogo_matematica', {
        game: {
            title: '',
            description: '',
            config: { operations: [], min: 1, max: 10, questions: 5 }
        },
        action: '/admin/matematica/novo',
        pageTitle: 'Criar Jogo de Matemática'
    });
};

exports.postCreateMath = async (req, res) => {
    let connection;
    try {
        const { title, description, operations, min, max, questions } = req.body;
        const createdBy = req.session.alunoId;

        if (parseInt(min) >= parseInt(max)) {
            return res.status(400).send('O valor mínimo deve ser menor que o máximo.');
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Montar o JSON de config
        // operations pode vir como array ['+', '-'] ou string '+'
        const opsArray = Array.isArray(operations) ? operations : [operations];

        const config = {
            operations: opsArray,
            min: parseInt(min),
            max: parseInt(max),
            questions: parseInt(questions)
        };

        await connection.query(
            'INSERT INTO math_games (title, description, config_json, created_by) VALUES (?, ?, ?, ?)',
            [title, description, JSON.stringify(config), createdBy]
        );

        await connection.commit();
        res.redirect('/admin');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar jogo de matemática:', error);
        res.status(500).send('Erro ao criar jogo.');
    } finally {
        if (connection) connection.release();
    }
};

exports.getEditMath = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM math_games WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Jogo não encontrado');

        // Parse config to pass to view
        const game = rows[0];
        if (typeof game.config_json === 'string') {
            game.config = JSON.parse(game.config_json);
        } else {
            game.config = game.config_json;
        }

        res.render('editar_jogo_matematica', {
            game: game,
            action: `/admin/matematica/${id}/editar`,
            pageTitle: 'Editar Jogo de Matemática'
        });
    } catch (error) {
        console.error('Erro ao buscar jogo para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

exports.postEditMath = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, operations, min, max, questions } = req.body;

        if (parseInt(min) >= parseInt(max)) {
            return res.status(400).send('Min deve ser menor que Max');
        }

        const opsArray = Array.isArray(operations) ? operations : [operations];
        const config = {
            operations: opsArray,
            min: parseInt(min),
            max: parseInt(max),
            questions: parseInt(questions)
        };

        await db.query(
            'UPDATE math_games SET title = ?, description = ?, config_json = ? WHERE id = ?',
            [title, description, JSON.stringify(config), id]
        );
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar jogo:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

exports.getMathGame = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM math_games WHERE id = ?', [id]);

        if (rows.length === 0) return res.status(404).send('Jogo não encontrado');

        res.render('jogo_matematica', { game: rows[0] });
    } catch (error) {
        console.error('Erro ao buscar jogo de matemática:', error);
        res.status(500).send('Erro interno.');
    }
};

// =============================================================================
// LISTAGEM GERAL (Helper para lista_jogos)
// =============================================================================
exports.getAllNewGames = async () => {
    try {
        const [typing] = await db.query('SELECT id, title, description, "digitacao" as type FROM typing_games');
        const [scramble] = await db.query('SELECT id, title, description, "palavras" as type FROM scramble_games');
        const [hangman] = await db.query('SELECT id, title, description, "forca" as type FROM hangman_games');
        const [math] = await db.query('SELECT id, title, description, "matematica" as type FROM math_games');
        const [quiz] = await db.query('SELECT id, title, description, "quiz" as type FROM quizzes');

        return [...typing, ...scramble, ...hangman, ...math, ...quiz];
    } catch (error) {
        console.error('Erro ao buscar novos jogos:', error);
        return [];
    }
};
