const db = require('../config/database');

// =============================================================================
// JOGO DA MEMÓRIA (memory_cards)
// =============================================================================

// LISTA (Admin)
exports.getEditList = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM memory_cards');
        res.render('editar_memoria_lista', { cards: rows });
    } catch (error) {
        console.error('Erro ao listar cartas da memória:', error);
        res.status(500).send('Erro interno.');
    }
};

// FORM CRIAR (Admin)
exports.getCreateForm = (req, res) => {
    res.render('editar_jogo_memoria', {
        card: { pair_name: '', pair_icon: '' },
        action: '/admin/memoria/criar',
        pageTitle: 'Criar Par de Cartas',
        isCreate: true
    });
};

// POST CRIAR (Admin)
exports.postCreate = async (req, res) => {
    try {
        const { pair_name, pair_icon } = req.body;
        await db.query(
            'INSERT INTO memory_cards (pair_name, pair_icon) VALUES (?, ?)',
            [pair_name, pair_icon]
        );
        res.redirect('/admin/memoria');
    } catch (error) {
        console.error('Erro ao criar carta:', error);
        res.status(500).send('Erro ao criar.');
    }
};

// FORM EDITAR (Admin)
exports.getEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM memory_cards WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).send('Carta não encontrada');

        res.render('editar_jogo_memoria', {
            card: rows[0],
            action: `/admin/memoria/${id}/editar`,
            pageTitle: 'Editar Par de Cartas',
            isCreate: false
        });
    } catch (error) {
        console.error('Erro ao buscar carta para edição:', error);
        res.status(500).send('Erro interno.');
    }
};

// POST EDITAR (Admin)
exports.postEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { pair_name, pair_icon } = req.body;
        await db.query(
            'UPDATE memory_cards SET pair_name = ?, pair_icon = ? WHERE id = ?',
            [pair_name, pair_icon, id]
        );
        res.redirect('/admin/memoria');
    } catch (error) {
        console.error('Erro ao atualizar carta:', error);
        res.status(500).send('Erro ao atualizar.');
    }
};

// POST EXCLUIR (Admin)
exports.postDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM memory_cards WHERE id = ?', [id]);
        res.redirect('/admin/memoria');
    } catch (error) {
        console.error('Erro ao excluir carta:', error);
        res.status(500).send('Erro ao excluir.');
    }
};

// JOGAR (Aluno)
exports.getGame = async (req, res) => {
    try {
        // Busca TODAS as cartas (pares)
        const [cardRows] = await db.query('SELECT pair_name as name, pair_icon as icon FROM memory_cards');

        const gameData = {
            title: 'Jogo da Memória',
            description: 'Encontre os pares iguais!'
        };

        res.render('jogo_memoria', { game: gameData, cards: cardRows });
    } catch (error) {
        console.error('Erro ao buscar jogo da memória:', error);
        res.status(500).send('Erro interno do servidor.');
    }
};

// Helper para lista_jogos (retorna item de menu único)
exports.getAllGames = async () => {
    return [{
        id: 'menu',
        title: 'Jogo da Memória',
        description: 'Encontre os pares!',
        type: 'memoria'
    }];
};
