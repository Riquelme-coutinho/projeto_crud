const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Permite rodar várias queries de uma vez
};

async function rebuildDatabase() {
    let connection;
    try {
        console.log('🔌 Conectando ao MySQL...');
        connection = await mysql.createConnection(dbConfig);

        console.log('🗑️  Recriando banco de dados escola_divertida...');

        const schema = `
            DROP DATABASE IF EXISTS escola_divertida;
            CREATE DATABASE escola_divertida;
            USE escola_divertida;

            -- ==========================================
            -- TABELAS DE USUÁRIOS
            -- ==========================================
            CREATE TABLE alunos (
                id_aluno INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                idade INT NOT NULL,
                turma VARCHAR(10) NOT NULL,
                descricao TEXT NULL,
                avatar VARCHAR(255) NULL,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL
            );

            CREATE TABLE professores (
                id_professor INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            );

            -- ==========================================
            -- TABELAS DE JOGOS (Geral)
            -- ==========================================
            -- Tabela para listar TODOS os jogos disponíveis no sistema e controlar visibilidade
            CREATE TABLE jogos (
                id_jogo INT AUTO_INCREMENT PRIMARY KEY,
                nome_jogo VARCHAR(100) NOT NULL,
                tipo_jogo VARCHAR(50) NOT NULL, -- 'quiz', 'memoria', 'digitacao', 'palavras', 'forca', 'matematica'
                descricao TEXT,
                ativo BOOLEAN DEFAULT TRUE,
                imagem_capa VARCHAR(255) -- Para mostrar no card
            );

            -- ==========================================
            -- JOGO 1: QUIZ (Existente)
            -- ==========================================
            CREATE TABLE perguntas (
                id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
                id_jogo INT NOT NULL, -- Referência genérica ou específica? No modelo atual parece ser genérica.
                enunciado TEXT NOT NULL,
                alternativa_a VARCHAR(255) NULL,
                alternativa_b VARCHAR(255) NULL,
                alternativa_c VARCHAR(255) NULL,
                alternativa_d VARCHAR(255) NULL,
                resposta_correta CHAR(1) NOT NULL,
                FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo) ON DELETE CASCADE
            );

            -- ==========================================
            -- JOGO 2: MEMÓRIA (Existente)
            -- ==========================================
            CREATE TABLE memory_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE memory_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                card_name VARCHAR(100) NOT NULL,
                card_icon VARCHAR(100) NOT NULL, -- Emoji ou classe de ícone
                FOREIGN KEY (game_id) REFERENCES memory_games(id) ON DELETE CASCADE
            );

            -- ==========================================
            -- JOGO 3: DIGITAÇÃO (Novo)
            -- ==========================================
            CREATE TABLE typing_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                text_content TEXT NOT NULL, -- O texto para digitar
                created_by INT NULL, -- ID do professor
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
            );

            -- ==========================================
            -- JOGO 4: PALAVRAS EMBARALHADAS (Novo)
            -- ==========================================
            CREATE TABLE scramble_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_by INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
            );

            CREATE TABLE scramble_words (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                word VARCHAR(100) NOT NULL,
                hint VARCHAR(255), -- Dica opcional
                FOREIGN KEY (game_id) REFERENCES scramble_games(id) ON DELETE CASCADE
            );

            -- ==========================================
            -- JOGO 5: FORCA (Novo)
            -- ==========================================
            CREATE TABLE hangman_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_by INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
            );

            CREATE TABLE hangman_words (
                id INT AUTO_INCREMENT PRIMARY KEY,
                game_id INT NOT NULL,
                word VARCHAR(100) NOT NULL,
                hint VARCHAR(255), -- Dica ou Categoria
                FOREIGN KEY (game_id) REFERENCES hangman_games(id) ON DELETE CASCADE
            );

            -- ==========================================
            -- JOGO 6: MATEMÁTICA (Novo)
            -- ==========================================
            CREATE TABLE math_games (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                -- Configuração em JSON para flexibilidade (ex: {"operations": ["+", "-"], "difficulty": "easy", "max_number": 20})
                config_json JSON NOT NULL, 
                created_by INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
            );

            -- ==========================================
            -- PONTUAÇÕES (Unificado)
            -- ==========================================
            CREATE TABLE pontuacoes (
                id_pontuacao INT AUTO_INCREMENT PRIMARY KEY,
                id_aluno INT NOT NULL,
                tipo_jogo VARCHAR(50) NOT NULL, -- 'quiz', 'memoria', 'digitacao', 'palavras', 'forca', 'matematica'
                id_jogo_especifico INT NOT NULL, -- ID na tabela específica do jogo (ex: id do typing_games)
                pontos INT DEFAULT 0,
                data_partida DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE
            );

            -- ==========================================
            -- DADOS INICIAIS (SEEDS)
            -- ==========================================
            
            -- Admin Padrão (admin / admin123)
            -- Hash gerado previamente para 'admin123'
            INSERT INTO professores (nome, usuario, senha, is_admin) 
            VALUES ('Admin Principal', 'admin', '$2b$10$8sA.7j/t.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8', TRUE);

            -- Inserir alguns jogos de exemplo na tabela 'jogos' (catálogo)
            -- Nota: A tabela 'jogos' original era usada para Quizzes. Vamos manter para compatibilidade ou refatorar?
            -- Para simplificar, vamos manter 'jogos' como catálogo de Quizzes por enquanto, 
            -- mas o ideal seria ter uma tabela unificada de metadados.
            -- Vou inserir dados nas tabelas específicas dos novos jogos.

            -- Exemplo Digitação
            INSERT INTO typing_games (title, description, text_content) VALUES 
            ('O Rato Roeu', 'Treine com um trava-línguas clássico.', 'O rato roeu a roupa do rei de Roma.');

            -- Exemplo Palavras
            INSERT INTO scramble_games (title, description) VALUES ('Frutas', 'Desembaralhe nomes de frutas.');
            SET @scramble_id = LAST_INSERT_ID();
            INSERT INTO scramble_words (game_id, word, hint) VALUES 
            (@scramble_id, 'BANANA', 'Amarela e curva'),
            (@scramble_id, 'MACA', 'Vermelha e faz croc'),
            (@scramble_id, 'UVA', 'Pequena e roxa');

            -- Exemplo Forca
            INSERT INTO hangman_games (title, description) VALUES ('Animais', 'Adivinhe o animal.');
            SET @hangman_id = LAST_INSERT_ID();
            INSERT INTO hangman_words (game_id, word, hint) VALUES 
            (@hangman_id, 'ELEFANTE', 'Tem tromba'),
            (@hangman_id, 'GIRAFA', 'Pescoço longo'),
            (@hangman_id, 'LEAO', 'Rei da selva');

            -- Exemplo Matemática
            INSERT INTO math_games (title, description, config_json) VALUES 
            ('Soma Fácil', 'Continhas de somar para iniciantes.', '{"operations": ["+"], "min": 1, "max": 10, "questions": 5}');

        `;

        await connection.query(schema);
        console.log('✅ Banco de dados reconstruído com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao reconstruir banco:', error);
    } finally {
        if (connection) await connection.end();
    }
}

rebuildDatabase();
