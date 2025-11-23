const mysql = require('mysql2');

// Cria o "pool" de conexões com o banco
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERRO ao obter conexão do pool:', err.stack);
        return;
    }
    console.log('✅ Conexão com o MySQL (via pool) estabelecida com sucesso!');
    connection.release(); // Importante: Devolve a conexão para o pool
});

// Exporta uma versão do "pool" que usa "Promises",
// o que facilita o uso com async/await no server.js
module.exports = pool.promise();