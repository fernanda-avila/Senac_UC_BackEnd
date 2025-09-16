const express = require('express');
const router = express.Router();


let generos = [
  { id: 1, nome: 'Ficção Científica' },
  { id: 2, nome: 'Fantasia' },
  { id: 3, nome: 'Romance' }
];


router.get('/', (req, res) => {
  res.json(generos);
});


router.get('/:id', (req, res) => {
  const genero = generos.find(g => g.id === parseInt(req.params.id));
  if (!genero) return res.status(404).json({ error: 'Gênero não encontrado' });
  res.json(genero);
});


router.post('/', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

  const novoGenero = {
    id: generos.length + 1,
    nome: nome
  };

  generos.push(novoGenero);
  res.status(201).json(novoGenero);
});


router.put('/:id', (req, res) => {
  const genero = generos.find(g => g.id === parseInt(req.params.id));
  if (!genero) return res.status(404).json({ error: 'Gênero não encontrado' });

  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

  genero.nome = nome;
  res.json(genero);
});


router.delete('/:id', (req, res) => {
  const generoIndex = generos.findIndex(g => g.id === parseInt(req.params.id));
  if (generoIndex === -1) return res.status(404).json({ error: 'Gênero não encontrado' });

  const generoDeletado = generos.splice(generoIndex, 1);
  res.json(generoDeletado[0]);
});

module.exports = router;