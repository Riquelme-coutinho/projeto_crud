require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'aluno_web',
        password: process.env.DB_PASSWORD || 'SenhaAluno@2025',
        database: process.env.DB_NAME || 'escola_divertida'
    });

    try {
        console.log('🔌 Conectado ao banco de dados.');

        // Tabela de Jogos de Memória
        await connection.query(`
            CREATE TABLE IF NOT EXISTS memory_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela memory_games verificada/criada.');

        // Tabela de Cartas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS memory_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                pair_name VARCHAR(50) NOT NULL,
                pair_icon VARCHAR(50) NOT NULL,
                FOREIGN KEY (game_id) REFERENCES memory_games(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabela memory_cards verificada/criada.');

    } catch (error) {
        console.error('❌ Erro ao configurar banco de dados:', error);
    } finally {
        await connection.end();
        console.log('🔌 Conexão encerrada.');
    }
}

setupDatabase();
