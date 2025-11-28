
const db = require('../config/database');

// =============================================================================
// JOGO DE DIGITAÇÃO (typing_texts)
// =============================================================================

// LISTA (Admin)
exports.getTypingList = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM typing_texts');
        res.render('editar_digitacao_lista', { texts: rows });
    } catch (error) {
        console.error('Erro ao listar textos de digitação:', error);
        res.status(500).send('Erro interno.');
    }
};

// FORM CRIAR (Admin)
exports.getCreateTyping = (req, res) => {
    res.render('editar_jogo_digitacao', {
        game: { title: '', text_content: '' },
        action: '/admin/digitacao/criar',
        pageTitle: 'Criar Texto de Digitação',
        isCreate: true
    });
};

// POST CRIAR (Admin)
exports.postCreateTyping = async (req, res) => {
    try {
        const { title, text_content } = req.body;
        await db.query(
            'INSERT INTO typing_texts (title, text_content) VALUES (?, ?)',
            [title, text_content]
        );
        res.redirect('/admin/digitacao');
    } catch (error) {
        console.error('Erro ao criar texto:', error);
        res.status(500).send('Erro ao criar.');
    }
};

// FORM EDITAR (Admin)
exports.getEditTyping = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM typing_texts WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Texto não encontrado');

        res.render('editar_jogo_digitacao', {
            game: rows[0],
            action: `/admin/digitacao/${id}/editar`,
            pageTitle: 'Editar Texto de Digitação',
            isCreate: false
        });
    } catch (error) {
        console.error('Erro ao buscar texto para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

// POST EDITAR (Admin)
exports.postEditTyping = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text_content } = req.body;
        await db.query(
            'UPDATE typing_texts SET title = ?, text_content = ? WHERE id = ?',
            [title, text_content, id]
        );
        res.redirect('/admin/digitacao');
    } catch (error) {
        console.error('Erro ao atualizar texto:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// POST EXCLUIR (Admin)
exports.postDeleteTyping = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM typing_texts WHERE id = ?', [id]);
        res.redirect('/admin/digitacao');
    } catch (error) {
        console.error('Erro ao excluir texto:', error);
        res.status(500).send('Erro ao excluir.');
    }
};

// JOGAR (Aluno)
exports.getTypingGame = async (req, res) => {
    try {
        const { id } = req.params;

        // Se for 'menu', mostra a tela de seleção
        if (id === 'menu') {
            const [rows] = await db.query('SELECT * FROM typing_texts');
            return res.render('jogo_digitacao_selecao', { texts: rows });
        }

        // Se for um ID específico, joga aquele nível
        const [rows] = await db.query('SELECT * FROM typing_texts WHERE id = ?', [id]);

        if (rows.length === 0) return res.status(404).send('Texto não encontrado.');

        // Busca o próximo jogo (ID maior que o atual, ordenado ascendente, limite 1)
        const [nextRows] = await db.query('SELECT id FROM typing_texts WHERE id > ? ORDER BY id ASC LIMIT 1', [id]);
        const nextGameId = nextRows.length > 0 ? nextRows[0].id : null;

        res.render('jogo_digitacao', { game: rows[0], nextGameId });
    } catch (error) {
        console.error('Erro ao buscar jogo de digitação:', error);
        res.status(500).send('Erro interno.');
    }
};


// =============================================================================
// JOGO DE PALAVRAS EMBARALHADAS (scramble_words)
// =============================================================================

// LISTA (Admin)
exports.getScrambleList = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM scramble_words');
        res.render('editar_palavras_lista', { words: rows });
    } catch (error) {
        console.error('Erro ao listar palavras:', error);
        res.status(500).send('Erro interno.');
    }
};

// FORM CRIAR (Admin)
exports.getCreateScramble = (req, res) => {
    res.render('editar_jogo_palavras', {
        word: { word: '', hint: '' },
        action: '/admin/palavras/criar',
        pageTitle: 'Criar Palavra (Embaralhada)',
        isCreate: true
    });
};

// POST CRIAR (Admin)
exports.postCreateScramble = async (req, res) => {
    try {
        const { word, hint } = req.body;
        await db.query(
            'INSERT INTO scramble_words (word, hint) VALUES (?, ?)',
            [word.toUpperCase(), hint]
        );
        res.redirect('/admin/palavras');
    } catch (error) {
        console.error('Erro ao criar palavra:', error);
        res.status(500).send('Erro ao criar.');
    }
};

// FORM EDITAR (Admin)
exports.getEditScramble = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM scramble_words WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Palavra não encontrada');

        res.render('editar_jogo_palavras', {
            word: rows[0],
            action: `/admin/palavras/${id}/editar`,
            pageTitle: 'Editar Palavra (Embaralhada)',
            isCreate: false
        });
    } catch (error) {
        console.error('Erro ao buscar palavra para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

// POST EDITAR (Admin)
exports.postEditScramble = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, hint } = req.body;
        await db.query(
            'UPDATE scramble_words SET word = ?, hint = ? WHERE id = ?',
            [word.toUpperCase(), hint, id]
        );
        res.redirect('/admin/palavras');
    } catch (error) {
        console.error('Erro ao atualizar palavra:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// POST EXCLUIR (Admin)
exports.postDeleteScramble = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM scramble_words WHERE id = ?', [id]);
        res.redirect('/admin/palavras');
    } catch (error) {
        console.error('Erro ao excluir palavra:', error);
        res.status(500).send('Erro ao excluir.');
    }
};

// JOGAR (Aluno) - Pega TODAS as palavras para o jogo
exports.getScrambleGame = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM scramble_words');
        // Passamos um objeto "game" fake para manter compatibilidade com a view ou ajustamos a view
        // Vamos ajustar a view para receber 'words' e um titulo generico
        const gameData = { title: 'Palavras Embaralhadas', description: 'Desembaralhe as palavras!' };

        res.render('jogo_palavras', { game: gameData, words: rows });
    } catch (error) {
        console.error('Erro ao buscar jogo de palavras:', error);
        res.status(500).send('Erro interno.');
    }
};


// =============================================================================
// JOGO DA FORCA (hangman_words)
// =============================================================================

// LISTA (Admin)
exports.getHangmanList = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM hangman_words');
        res.render('editar_forca_lista', { words: rows });
    } catch (error) {
        console.error('Erro ao listar palavras da forca:', error);
        res.status(500).send('Erro interno.');
    }
};

// FORM CRIAR (Admin)
exports.getCreateHangman = (req, res) => {
    res.render('editar_jogo_forca', {
        word: { word: '', hint: '' },
        action: '/admin/forca/criar',
        pageTitle: 'Criar Palavra (Forca)',
        isCreate: true
    });
};

// POST CRIAR (Admin)
exports.postCreateHangman = async (req, res) => {
    try {
        const { word, hint } = req.body;
        await db.query(
            'INSERT INTO hangman_words (word, hint) VALUES (?, ?)',
            [word.toUpperCase(), hint]
        );
        res.redirect('/admin/forca');
    } catch (error) {
        console.error('Erro ao criar palavra:', error);
        res.status(500).send('Erro ao criar.');
    }
};

// FORM EDITAR (Admin)
exports.getEditHangman = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM hangman_words WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Palavra não encontrada');

        res.render('editar_jogo_forca', {
            word: rows[0],
            action: `/admin/forca/${id}/editar`,
            pageTitle: 'Editar Palavra (Forca)',
            isCreate: false
        });
    } catch (error) {
        console.error('Erro ao buscar palavra para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

// POST EDITAR (Admin)
exports.postEditHangman = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, hint } = req.body;
        await db.query(
            'UPDATE hangman_words SET word = ?, hint = ? WHERE id = ?',
            [word.toUpperCase(), hint, id]
        );
        res.redirect('/admin/forca');
    } catch (error) {
        console.error('Erro ao atualizar palavra:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// POST EXCLUIR (Admin)
exports.postDeleteHangman = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM hangman_words WHERE id = ?', [id]);
        res.redirect('/admin/forca');
    } catch (error) {
        console.error('Erro ao excluir palavra:', error);
        res.status(500).send('Erro ao excluir.');
    }
};

// JOGAR (Aluno)
exports.getHangmanGame = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM hangman_words');
        const gameData = { title: 'Jogo da Forca', description: 'Adivinhe a palavra secreta!' };

        res.render('jogo_forca', { game: gameData, words: rows });
    } catch (error) {
        console.error('Erro ao buscar jogo da forca:', error);
        res.status(500).send('Erro interno.');
    }
};


// =============================================================================
// JOGO DE MATEMÁTICA (math_levels)
// =============================================================================

// LISTA (Admin)
exports.getMathList = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM math_levels');
        res.render('editar_matematica_lista', { levels: rows });
    } catch (error) {
        console.error('Erro ao listar níveis de matemática:', error);
        res.status(500).send('Erro interno.');
    }
};

// FORM CRIAR (Admin)
exports.getCreateMath = (req, res) => {
    // Configuração padrão para novo nível
    const defaultLevel = {
        title: '',
        config: {
            operations: ['+'],
            min: 1,
            max: 10,
            questions: 10
        }
    };

    res.render('editar_jogo_matematica', {
        level: defaultLevel,
        action: '/admin/matematica/criar',
        pageTitle: 'Criar Nível de Matemática',
        isCreate: true
    });
};

// POST CRIAR (Admin)
exports.postCreateMath = async (req, res) => {
    try {
        const { title, operations, min, max, questions } = req.body;

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
            'INSERT INTO math_levels (title, config_json) VALUES (?, ?)',
            [title, JSON.stringify(config)]
        );
        res.redirect('/admin/matematica');
    } catch (error) {
        console.error('Erro ao criar nível:', error);
        res.status(500).send('Erro ao criar.');
    }
};

// FORM EDITAR (Admin)
exports.getEditMath = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM math_levels WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Nível não encontrado');

        const level = rows[0];
        // Parse config se necessário (mysql2 geralmente já faz se for JSON column, mas garantindo)
        if (typeof level.config_json === 'string') {
            level.config = JSON.parse(level.config_json);
        } else {
            level.config = level.config_json;
        }

        res.render('editar_jogo_matematica', {
            level: level,
            action: `/admin/matematica/${id}/editar`,
            pageTitle: 'Editar Nível de Matemática',
            isCreate: false
        });
    } catch (error) {
        console.error('Erro ao buscar nível para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

// POST EDITAR (Admin)
exports.postEditMath = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, operations, min, max, questions } = req.body;

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
            'UPDATE math_levels SET title = ?, config_json = ? WHERE id = ?',
            [title, JSON.stringify(config), id]
        );
        res.redirect('/admin/matematica');
    } catch (error) {
        console.error('Erro ao atualizar nível:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// POST EXCLUIR (Admin)
exports.postDeleteMath = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM math_levels WHERE id = ?', [id]);
        res.redirect('/admin/matematica');
    } catch (error) {
        console.error('Erro ao excluir nível:', error);
        res.status(500).send('Erro ao excluir.');
    }
};

// JOGAR (Aluno)
exports.getMathGame = async (req, res) => {
    try {
        const { id } = req.params; // ID do nível

        // Se for 'menu', mostra a tela de seleção
        if (id === 'menu') {
            const [rows] = await db.query('SELECT * FROM math_levels');
            return res.render('jogo_matematica_selecao', { levels: rows });
        }

        const [rows] = await db.query('SELECT * FROM math_levels WHERE id = ?', [id]);

        if (rows.length === 0) return res.status(404).send('Nível não encontrado');

        const level = rows[0];

        // Garante que config_json seja um objeto
        let configObj = level.config_json;
        if (typeof configObj === 'string') {
            configObj = JSON.parse(configObj);
        }

        // Adapta para a view esperar 'game'
        const gameData = {
            title: level.title,
            description: 'Resolva as questões matemáticas!',
            config_json: configObj
        };

        res.render('jogo_matematica', { game: gameData });
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
        // Agora retornamos apenas UM item de menu para cada tipo de jogo

        const typing = [{ id: 'menu', title: 'Digitação', description: 'Pratique sua digitação', type: 'digitacao' }];

        const scramble = [{ id: 'menu', title: 'Palavras Embaralhadas', description: 'Desafie seu vocabulário', type: 'palavras' }];

        const hangman = [{ id: 'menu', title: 'Jogo da Forca', description: 'Adivinhe a palavra', type: 'forca' }];

        const math = [{ id: 'menu', title: 'Matemática', description: 'Desafio matemático', type: 'matematica' }];

        // Quiz: Já tem seção própria na view, não precisa retornar aqui

        return [...typing, ...scramble, ...hangman, ...math];
    } catch (error) {
        console.error('Erro ao buscar novos jogos:', error);
        return [];
    }
};
