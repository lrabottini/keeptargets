import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'
import { fieldValidation, hasOrg } from '../middleware/valida-chamada.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/centrocusto', fieldValidation, hasOrg, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const centroCusto = new CentroCusto()

            centroCusto.centrocusto_org = req.body.org
            centroCusto.centrocusto_cod = req.body.codigo
            centroCusto.centrocusto_descr = req.body.descricao
            centroCusto.centrocusto_parent = Number(req.body.parent) === 0? Number(req.body.parent) : new mongoose.Types.ObjectId(req.body.parent)

            await centroCusto.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Centro de custo criado com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar centro de custo.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar centro de custo.',
            req.params,
            e.stack 
        )
        error
    }
})

export { router as createCentroCusto }