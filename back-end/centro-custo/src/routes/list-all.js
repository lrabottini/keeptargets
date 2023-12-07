import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'

const router = express.Router()

router.get('/centrocusto/all/:org', async (req, res) => {
    try {
        const centrocusto = await CentroCusto.find({centrocusto_org: req.params.org})

        res.send(centrocusto)
    } catch (e) {
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar centros de custo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as listAllCentroCusto }