import express from 'express'

import { validationResult } from 'express-validator'
import { fieldValidation, hasOrg } from '../middleware/valida-chamada.js'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/estrutura', fieldValidation, hasOrg, async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const estrutura = new Estrutura()

            estrutura.estrutura_org = new mongoose.Types.ObjectId(req.body.org)
            estrutura.estrutura_cod = req.body.codigo
            estrutura.estrutura_descr = req.body.descricao
            estrutura.estrutura_parent = Number(req.body.parent) === 0 || req.body.parent === null ? Number(req.body.parent) : new mongoose.Types.ObjectId(req.body.parent)
            estrutura.estrutura_responsavel = new mongoose.Types.ObjectId(req.body.responsavel)
            estrutura.estrutura_allowPlan = req.body.permite_plano

            await estrutura.save()
            
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Estrutura criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_INFO,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar estrutura.',
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
            'Não foi possíve criar estrutura.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as createEstrutura }