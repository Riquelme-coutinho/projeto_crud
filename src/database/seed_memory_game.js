const db = require('../config/database');

const defaultCards = [
    { name: 'atom', icon: '⚛️' },
    { name: 'book', icon: '📚' },
    { name: 'brain', icon: '🧠' },
    { name: 'bulb', icon: '💡' },
    { name: 'calculator', icon: '🧮' },
    { name: 'microscope', icon: '🔬' },
    { name: 'planet', icon: '🪐' },
    { name: 'rocket', icon: '🚀' }
];

async function seedGame() {
    try {
        // Check if default game exists
        const [rows] = await db.query('SELECT * FROM memory_games WHERE title = ?', ['Jogo Padrão']);

        if (rows.length > 0) {
            console.log('Default game already exists.');
            process.exit(0);
        }

        console.log('Creating default game...');
        const [result] = await db.query('INSERT INTO memory_games (title, description) VALUES (?, ?)',
            ['Jogo Padrão', 'O clássico jogo da memória com ícones de ciência!']);

        const gameId = result.insertId;

        console.log('Adding cards...');
        for (const card of defaultCards) {
            await db.query('INSERT INTO memory_cards (game_id, card_name, card_icon) VALUES (?, ?, ?)',
                [gameId, card.name, card.icon]);
        }

        console.log('Default game created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding game:', error);
        process.exit(1);
    }
}

seedGame();
