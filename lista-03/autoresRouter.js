const express = require('express');
const router = express.Router();
const db = require('../db');

const validarAutor = (req, res, next) => {
    const { nome } = req.body;
    if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome do autor é obrigatório' });
    }
    next();
};

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM AUTOR WHERE excluido = FALSE ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar autores:', error);
        res.status(500).json({ error: 'Erro ao buscar autores' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM AUTOR WHERE id = ? AND excluido = FALSE', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Autor não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar autor:', error);
        res.status(500).json({ error: 'Erro ao buscar autor' });
    }
});

router.post('/', validarAutor, async (req, res) => {
    try {
        const { nome, nacionalidade } = req.body;
        const result = await db.query(
            'INSERT INTO AUTOR (nome, nacionalidade) VALUES (?, ?)',
            [nome, nacionalidade || null]
        );
        
        const [newAutor] = await db.query('SELECT * FROM AUTOR WHERE id = LAST_INSERT_ID()');
        res.status(201).json(newAutor.rows[0]);
    } catch (error) {
        console.error('Erro ao criar autor:', error);
        res.status(500).json({ error: 'Erro ao criar autor' });
    }
});

router.put('/:id', validarAutor, async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, nacionalidade } = req.body;
        
        const result = await db.query(
            'UPDATE AUTOR SET nome = ?, nacionalidade = ? WHERE id = ? AND excluido = FALSE',
            [nome, nacionalidade || null, id]
        );
        
        const [updatedAutor] = await db.query('SELECT * FROM AUTOR WHERE id = ?', [id]);
        
        if (updatedAutor.rows.length === 0) {
            return res.status(404).json({ error: 'Autor não encontrado' });
        }
        
        res.json(updatedAutor.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar autor:', error);
        res.status(500).json({ error: 'Erro ao atualizar autor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query(
            'UPDATE AUTOR SET excluido = TRUE WHERE id = ?',
            [id]
        );
        
        const [deletedAutor] = await db.query('SELECT * FROM AUTOR WHERE id = ?', [id]);
        
        if (deletedAutor.rows.length === 0) {
            return res.status(404).json({ error: 'Autor não encontrado' });
        }
        
        res.json({ message: 'Autor excluído logicamente', autor: deletedAutor.rows[0] });
    } catch (error) {
        console.error('Erro ao excluir autor:', error);
        res.status(500).json({ error: 'Erro ao excluir autor' });
    }
});

module.exports = router;