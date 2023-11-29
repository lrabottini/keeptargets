import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'

const router = express.Router()

router.post('/centrocusto', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const centroCusto = new CentroCusto()

            centroCusto.centrocusto_cod = req.body.codigo
            centroCusto.centrocusto_descr = req.body.descricao
            centroCusto.centrocusto_parent = req.body.parent

            await centroCusto.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Centro de custo criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar centro de custo.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar centro de custo.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createCentroCusto }