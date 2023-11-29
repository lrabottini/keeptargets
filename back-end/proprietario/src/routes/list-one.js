import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Proprietario } from '../models/proprietario.js'

const router = express.Router()

router.get('/proprietario/:id', async (req, res) => {
    try {
        await Proprietario.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Proprietário não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar proprietario.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneProprietario }