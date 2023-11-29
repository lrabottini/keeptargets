import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Fornecedor } from '../models/fornecedor.js'

const router = express.Router()

router.get('/fornecedor/:id', async (req, res) => {
    try {
        await Fornecedor.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Fornecedor não encontrado.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar fornecedor.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneFornecedor }