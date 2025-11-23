const db = require('../config/database');

// Renderiza a página de criação de jogo
exports.getCreatePage = (req, res) => {
    try {
        res.render('criar_jogo_memoria');
    } catch (error) {
        console.error('Erro ao renderizar página de criação:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Cria um novo jogo e seus cards
exports.postCreateGame = async (req, res) => {
    let connection;
    try {
        const { title, description, card_names, card_icons } = req.body;

        if (!title || !card_names || !card_icons || card_names.length < 2) {
            return res.status(400).send('Título e pelo menos 2 pares de cartas são obrigatórios.');
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Criar o jogo
        const [gameResult] = await connection.query(
            'INSERT INTO memory_games (title, description) VALUES (?, ?)',
            [title, description]
        );
        const gameId = gameResult.insertId;

        // 2. Criar os cards
        // card_names e card_icons vêm como arrays do formulário
        const cardPromises = [];
        for (let i = 0; i < card_names.length; i++) {
            cardPromises.push(connection.query(
                'INSERT INTO memory_cards (game_id, card_name, card_icon) VALUES (?, ?, ?)',
                [gameId, card_names[i], card_icons[i]]
            ));
        }
        await Promise.all(cardPromises);

        await connection.commit();
        res.redirect('/jogos');

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar jogo:', error);
        res.status(500).send('Erro ao criar o jogo.');
    } finally {
        if (connection) connection.release();
    }
};

// Busca um jogo específico e renderiza a view de jogar
exports.getGame = async (req, res) => {
    try {
        const gameId = req.params.id;

        // Buscar informações do jogo
        const [gameRows] = await db.query('SELECT * FROM memory_games WHERE id = ?', [gameId]);
        if (gameRows.length === 0) {
            return res.status(404).send('Jogo não encontrado.');
        }
        const game = gameRows[0];

        // Buscar cartas do jogo
        const [cardRows] = await db.query('SELECT card_name as name, card_icon as icon FROM memory_cards WHERE game_id = ?', [gameId]);

        res.render('jogo_memoria', { game, cards: cardRows });
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Busca todos os jogos de memória (para a lista)
exports.getAllGames = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM memory_games ORDER BY created_at DESC');
        return rows;
    } catch (error) {
        console.error('Erro ao buscar jogos de memória:', error);
        return [];
    }
};
