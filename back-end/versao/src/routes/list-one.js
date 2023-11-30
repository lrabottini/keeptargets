import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Versao } from '../models/versao.js'

const router = express.Router()

router.get('/versao/:id', async (req, res) => {
    try {
        await Versao.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Versão não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar versão.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneVersao }