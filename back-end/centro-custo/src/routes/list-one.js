import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'

const router = express.Router()

router.get('/centrocusto/:id', async (req, res) => {
    try {
        await CentroCusto.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_WARNING,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Centro de Custo não encontrado.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar centro de custo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listOneCentroCusto }