const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const generosRouter = require('./routes/generosRouter');
const autoresRouter = require('./routes/autoresRouter');

app.use('/api/generos', generosRouter);
app.use('/api/autores', autoresRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Biblioteca',
        endpoints: {
            generos: '/api/generos',
            autores: '/api/autores'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});