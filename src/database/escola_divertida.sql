-- 1. CONFIGURAÇÃO INICIAL E CRIAÇÃO DO BANCO
-- ==========================================
SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

-- Cria o banco se não existir e seleciona ele
CREATE DATABASE IF NOT EXISTS `escola_divertida`;
USE `escola_divertida`;

-- 2. CRIAÇÃO DAS TABELAS E DADOS
-- ==========================================

-- Tabela: alunos
DROP TABLE IF EXISTS `alunos`;
CREATE TABLE `alunos` (
  `id_aluno` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `idade` int NOT NULL,
  `turma` varchar(10) NOT NULL,
  `descricao` text,
  `avatar` varchar(255) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id_aluno`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `alunos` VALUES 
(1,'Riquelme Fernandes Coutinho',21,'integral','gdgsdgds','5m3bemku','Riquelme','$2b$10$s6jKR8QtjXObSuIF0Jho9eh00s8BJKv4mJi7sIHx8o9gIHrTy7Vqm'),
(6,'yago',16,'2B',NULL,NULL,'yaguin555','$2b$10$N2pSZFNNtiv.oBx140EfnOnT7Hccphral8W0UWapTwTAKPUbNimCC');

-- Tabela: hangman_words (Jogo da Forca)
DROP TABLE IF EXISTS `hangman_words`;
CREATE TABLE `hangman_words` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(100) NOT NULL,
  `hint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `hangman_words` VALUES 
(2,'DINOSSAURO','Animal extinto gigante'),
(3,'MICROSCOPIO','Usado para ver coisas pequenas'),
(4,'OCEANO','Grande massa de água salgada'),
(5,'VULCAO','Montanha que cospe fogo'),
(6,'HELICOPTERO','Aeronave com hélices'),
(7,'ARQUITETO','Projeta casas e prédios'),
(8,'BIBLIOTECA','Lugar cheio de livros'),
(9,'ORQUESTRA','Grupo de músicos'),
(10,'LABORATORIO','Lugar de fazer experimentos'),
(11,'BANANA','Banana');

-- Tabela: jogos
DROP TABLE IF EXISTS `jogos`;
CREATE TABLE `jogos` (
  `id_jogo` int NOT NULL AUTO_INCREMENT,
  `nome_jogo` varchar(100) NOT NULL,
  `tipo_jogo` varchar(50) NOT NULL,
  `descricao` text,
  `ativo` tinyint(1) DEFAULT '1',
  `imagem_capa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_jogo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: math_levels (Matemática)
DROP TABLE IF EXISTS `math_levels`;
CREATE TABLE `math_levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `config_json` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `math_levels` VALUES 
(1,'Nível 1: Soma Simples','{\"max\": 10, \"min\": 1, \"questions\": 10, \"operations\": [\"+\"]}'),
(2,'Nível 2: Subtração','{\"max\": 20, \"min\": 1, \"questions\": 5, \"operations\": [\"-\"]}'),
(3,'Nível 3: Multiplicação Básica','{\"max\": 10, \"min\": 1, \"questions\": 5, \"operations\": [\"*\"]}'),
(4,'Nível 4: Divisão','{\"max\": 20, \"min\": 1, \"questions\": 5, \"operations\": [\"/\"]}'),
(5,'Nível 5: Desafio Misto','{\"max\": 50, \"min\": 1, \"questions\": 10, \"operations\": [\"+\", \"-\", \"*\", \"/\"]}'),
(6,'diversão','{\"max\": 10, \"min\": 1, \"questions\": 2, \"operations\": [\"+\", \"-\", \"*\", \"/\"]}');

-- Tabela: memory_cards (Cartas da Memória)
DROP TABLE IF EXISTS `memory_cards`;
CREATE TABLE `memory_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pair_name` varchar(50) NOT NULL,
  `pair_icon` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `memory_cards` VALUES 
(1,'Leão','?'),(2,'Elefante','?'),(3,'Girafa','?'),(4,'Macaco','?'),(5,'Cachorro','?'),(6,'Gato','?'),(7,'Raposa','?'),(8,'Urso','?'),(9,'Panda','?'),(10,'Coelho','?');

-- Tabela: memory_games
DROP TABLE IF EXISTS `memory_games`;
CREATE TABLE `memory_games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `memory_games` VALUES 
(1,'Jogo Padrão','O clássico jogo da memória com ícones de ciência!','2025-11-23 17:24:00');

-- Tabela: perguntas
DROP TABLE IF EXISTS `perguntas`;
CREATE TABLE `perguntas` (
  `id_pergunta` int NOT NULL AUTO_INCREMENT,
  `id_jogo` int NOT NULL,
  `enunciado` text NOT NULL,
  `alternativa_a` varchar(255) DEFAULT NULL,
  `alternativa_b` varchar(255) DEFAULT NULL,
  `alternativa_c` varchar(255) DEFAULT NULL,
  `alternativa_d` varchar(255) DEFAULT NULL,
  `resposta_correta` char(1) NOT NULL,
  PRIMARY KEY (`id_pergunta`),
  KEY `id_jogo` (`id_jogo`),
  CONSTRAINT `perguntas_ibfk_1` FOREIGN KEY (`id_jogo`) REFERENCES `jogos` (`id_jogo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: pontuacoes
DROP TABLE IF EXISTS `pontuacoes`;
CREATE TABLE `pontuacoes` (
  `id_pontuacao` int NOT NULL AUTO_INCREMENT,
  `id_aluno` int NOT NULL,
  `tipo_jogo` varchar(50) NOT NULL,
  `id_jogo_especifico` int NOT NULL,
  `pontos` int DEFAULT '0',
  `data_partida` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pontuacao`),
  KEY `id_aluno` (`id_aluno`),
  CONSTRAINT `pontuacoes_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `alunos` (`id_aluno`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela: professores
DROP TABLE IF EXISTS `professores`;
CREATE TABLE `professores` (
  `id_professor` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_professor`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `professores` VALUES 
(3,'Professor Admin','admin','$2b$10$G5YwSebQt9tOEwH8UmZ1.eXGbsCIubK43xKqFkAaaoOxoRWMboiHK',1);

-- Tabela: quizzes
DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `id_quiz` int NOT NULL AUTO_INCREMENT,
  `pergunta` text NOT NULL,
  `resposta_correta` varchar(255) NOT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_quiz`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `quizzes` VALUES 
(1,'A Terra é redonda?','true','https://img.freepik.com/psd-gratuitas/educacao-da-escola-de-bola-da-terra_23-2151848239.jpg?semt=ais_hybrid&w=740&q=80'),
(2,'O Sol gira em torno da Terra?','true',NULL),
(3,'A água ferve a 100°C ao nível do mar?','true',NULL),
(4,'Os dinossauros ainda existem?','false',NULL),
(12,'O Sol gira em torno da Terra?','false',NULL),
(14,'Os dinossauros ainda existem?','false',NULL),
(15,'O Brasil é o maior país da América do Sul?','true',NULL),
(16,'A Lua é maior que a Terra?','false',NULL),
(17,'As plantas produzem oxigênio?','true',NULL),
(18,'O gelo é mais pesado que a água?','false',NULL),
(21,'Você é inteligente?','true','https://www.shutterstock.com/image-vector/address-navigation-bar-https-www-260nw-2572492335.jpg');

-- Tabela: scramble_words (Palavras Embaralhadas)
DROP TABLE IF EXISTS `scramble_words`;
CREATE TABLE `scramble_words` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(100) NOT NULL,
  `hint` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `scramble_words` VALUES 
(1,'MORANGO','Fruta vermelha'),
(2,'ELEFANTE','Maior animal terrestre'),
(3,'COMPUTADOR','Máquina usada para estudar'),
(4,'ESCOLA','Lugar de aprender'),
(5,'BRASIL','Nosso país'),
(6,'FUTEBOL','Esporte popular'),
(7,'GIRAFA','Tem pescoço longo'),
(8,'ABACAXI','Fruta com coroa'),
(11,'JACARE','Bicho grande de agua');

-- Tabela: typing_texts (Digitação)
DROP TABLE IF EXISTS `typing_texts`;
CREATE TABLE `typing_texts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `text_content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `typing_texts` VALUES 
(1,'Nível 1: O Rato','O Rato roeu a roupa do rei de Roma.'),
(2,'Nível 2: O Sabiá','O sabiá não sabia que o sábio sabia que o sabiá não sabia assobiar.'),
(3,'Nível 3: Três Tigres','Três pratos de trigo para três tigres tristes.'),
(4,'Nível 4: O Tempo','O tempo perguntou ao tempo quanto tempo o tempo tem.'),
(5,'Nível 5: A Aranha','A aranha arranha a rã. A rã arranha a aranha. Nem a aranha arranha a rã. Nem a rã arranha a aranha.'),
(6,'Canto','Eu sou inteligente');

-- RESTAURAR CONFIGURAÇÕES FINAIS
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;