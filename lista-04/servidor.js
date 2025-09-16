const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const eventos = await prisma.evento.findMany({
            orderBy: { data: 'asc' },
        });
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ error: 'Não foi possível buscar os eventos.' });
    }
});

router.post('/:id/inscrever', async (req, res) => {
    try {
        const eventoId = parseInt(req.params.id);
        const { nomeAluno, emailAluno } = req.body;

        if (!nomeAluno || !emailAluno) {
            return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
        }

        const evento = await prisma.evento.findUnique({
            where: { id: eventoId },
            include: { _count: { select: { inscricoes: true } } }
        });

        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado.' });
        }

        if (evento._count.inscricoes >= evento.vagas) {
            return res.status(409).json({ error: 'Vagas esgotadas para este evento.' });
        }

        const inscricaoExistente = await prisma.inscricao.findFirst({
            where: { eventoId, emailAluno },
        });

        if (inscricaoExistente) {
            return res.status(409).json({ error: 'Este e-mail já está inscrito no evento.' });
        }

        const novaInscricao = await prisma.inscricao.create({
            data: {
                nomeAluno,
                emailAluno,
                evento: { connect: { id: eventoId } },
            },
        });

        res.status(201).json(novaInscricao);

    } catch (error) {
        console.error("Erro ao criar inscrição:", error);
        res.status(500).json({ error: 'Não foi possível realizar a inscrição.' });
    }
});

// ROTA NOVA: LISTAR TODOS OS ALUNOS INSCRITOS EM UM EVENTO
router.get('/:id/alunos', async (req, res) => {
    try {
        const eventoId = parseInt(req.params.id);

        const alunos = await prisma.inscricao.findMany({
            where: { eventoId },
            select: {
                id: true,
                nomeAluno: true,
                emailAluno: true
            }
        });

        if (alunos.length === 0) {
            return res.status(404).json({ message: 'Nenhum aluno inscrito neste evento.' });
        }

        res.json(alunos);

    } catch (error) {
        console.error("Erro ao buscar alunos inscritos:", error);
        res.status(500).json({ error: 'Não foi possível buscar os alunos inscritos.' });
    }
});

module.exports = router;
