const db = require('../config/database');

async function createTables() {
    try {
        console.log('Creating memory_games table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS memory_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating memory_cards table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS memory_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                card_name VARCHAR(50) NOT NULL,
                card_icon VARCHAR(255) NOT NULL,
                FOREIGN KEY (game_id) REFERENCES memory_games(id) ON DELETE CASCADE
            )
        `);

        console.log('Tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createTables();
