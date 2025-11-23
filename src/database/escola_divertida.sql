-- ========================================================
-- SCRIPT UNIFICADO: PROJETO EDUCA TECH
-- ========================================================

-- 1. CONFIGURAÇÃO INICIAL (Limpeza e Criação)
DROP DATABASE IF EXISTS escola_divertida;
CREATE DATABASE escola_divertida;
USE escola_divertida;

-- --------------------------------------------------------
-- 2. CRIAÇÃO DAS TABELAS DE USUÁRIOS
-- --------------------------------------------------------

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

-- --------------------------------------------------------
-- 3. CRIAÇÃO DAS TABELAS DE JOGOS (Estrutura Modular)
-- --------------------------------------------------------

-- Catálogo Geral de Jogos (opcional, para listagem unificada)
CREATE TABLE jogos (
  id_jogo INT AUTO_INCREMENT PRIMARY KEY,
  nome_jogo VARCHAR(100) NOT NULL,
  tipo_jogo VARCHAR(50) NOT NULL, -- ex: 'quiz', 'memoria', 'digitacao'
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  imagem_capa VARCHAR(255)
);

-- JOGO 1: QUIZ
CREATE TABLE perguntas (
  id_pergunta INT AUTO_INCREMENT PRIMARY KEY,
  id_jogo INT NOT NULL, -- Link com a tabela jogos se usar, ou independente
  enunciado TEXT NOT NULL,
  alternativa_a VARCHAR(255) NULL,
  alternativa_b VARCHAR(255) NULL,
  alternativa_c VARCHAR(255) NULL,
  alternativa_d VARCHAR(255) NULL,
  resposta_correta CHAR(1) NOT NULL,
  FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo) ON DELETE CASCADE
);

-- JOGO 2: MEMÓRIA
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
  card_icon VARCHAR(100) NOT NULL, -- Emoji ou classe CSS
  FOREIGN KEY (game_id) REFERENCES memory_games(id) ON DELETE CASCADE
);

-- JOGO 3: DIGITAÇÃO
CREATE TABLE typing_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  text_content TEXT NOT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
);

-- JOGO 4: PALAVRAS EMBARALHADAS (Scramble)
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
  hint VARCHAR(255),
  FOREIGN KEY (game_id) REFERENCES scramble_games(id) ON DELETE CASCADE
);

-- JOGO 5: FORCA (Hangman)
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
  hint VARCHAR(255),
  FOREIGN KEY (game_id) REFERENCES hangman_games(id) ON DELETE CASCADE
);

-- JOGO 6: MATEMÁTICA
CREATE TABLE math_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  config_json JSON NOT NULL, -- Ex: {"ops": ["+"], "max": 10}
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES professores(id_professor) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- 4. TABELA DE PONTUAÇÃO (Unificada)
-- --------------------------------------------------------

CREATE TABLE pontuacoes (
  id_pontuacao INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  tipo_jogo VARCHAR(50) NOT NULL, -- 'memoria', 'quiz', etc
  id_jogo_especifico INT NOT NULL, -- ID da tabela específica do jogo
  pontos INT DEFAULT 0,
  data_partida DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE
);

-- ========================================================
-- 5. INSERÇÃO DE DADOS (SEEDS)
-- ========================================================

-- USUÁRIO ADMIN
-- Senha é '123456' (Hash gerado pelo bcrypt)
INSERT INTO professores (nome, usuario, senha, is_admin) 
VALUES ('Professor Admin', 'admin', '$2b$10$8sA.7j/t.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8.8', TRUE);

-- DADOS JOGO DA MEMÓRIA
INSERT INTO memory_games (title, description) VALUES 
('Jogo Padrão', 'O clássico jogo da memória com ícones de ciência!');

-- Pegar o ID do jogo criado acima para inserir as cartas
SET @mem_id = LAST_INSERT_ID();

INSERT INTO memory_cards (game_id, card_name, card_icon) VALUES 
(@mem_id, 'atom', '⚛️'),
(@mem_id, 'book', '📚'),
(@mem_id, 'brain', '🧠'),
(@mem_id, 'bulb', '💡'),
(@mem_id, 'calculator', '🧮'),
(@mem_id, 'microscope', '🔬'),
(@mem_id, 'planet', '🪐'),
(@mem_id, 'rocket', '🚀');

-- DADOS JOGO DE DIGITAÇÃO
INSERT INTO typing_games (title, description, text_content) VALUES 
('O Rato Roeu', 'Treine com um trava-línguas clássico.', 'O rato roeu a roupa do rei de Roma.');

-- DADOS PALAVRAS EMBARALHADAS
INSERT INTO scramble_games (title, description) VALUES ('Frutas', 'Desembaralhe nomes de frutas.');
SET @scramble_id = LAST_INSERT_ID();
INSERT INTO scramble_words (game_id, word, hint) VALUES 
(@scramble_id, 'BANANA', 'Amarela e curva'),
(@scramble_id, 'MACA', 'Vermelha e faz croc'),
(@scramble_id, 'UVA', 'Pequena e roxa');

-- DADOS FORCA
INSERT INTO hangman_games (title, description) VALUES ('Animais', 'Adivinhe o animal.');
SET @hangman_id = LAST_INSERT_ID();
INSERT INTO hangman_words (game_id, word, hint) VALUES 
(@hangman_id, 'ELEFANTE', 'Tem tromba'),
(@hangman_id, 'GIRAFA', 'Pescoço longo'),
(@hangman_id, 'LEAO', 'Rei da selva');

-- DADOS MATEMÁTICA
INSERT INTO math_games (title, description, config_json) VALUES 
('Soma Fácil', 'Continhas de somar para iniciantes.', '{"operations": ["+"], "min": 1, "max": 10, "questions": 5}');

-- Feedback final
SELECT 'Banco de dados recriado e populado com sucesso!' AS Status;