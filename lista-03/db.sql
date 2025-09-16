CREATE DATABASE biblioteca;

USE biblioteca;

CREATE TABLE AUTOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(50),
    excluido BOOLEAN DEFAULT FALSE
);

-- Adicionar coluna excluido se já existir a tabela
ALTER TABLE AUTOR ADD COLUMN excluido BOOLEAN DEFAULT FALSE;