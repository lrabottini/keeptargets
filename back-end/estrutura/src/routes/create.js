import express from 'express'

import { validationResult } from 'express-validator'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()

router.post('/estrutura', async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const estrutura = new Estrutura()

            estrutura.estrut_cod = req.body.codigo
            estrutura.estrut_descr = req.body.descricao
            estrutura.estrut_parent = req.body.parent

            await estrutura.save()
            
            const message = new ExecutionMessage(
                ExecutionStatus.SUCCESS,
                ExecutionTypes.CREATE,
                'Estrutura criada com sucesso.',
                req.body,
                result.array()
            )
            res.send(message)
        } else {
            const message = new ExecutionMessage(
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível criar estrutura.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e) {
        const message = new ExecutionMessage(
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Não foi possíve criar Não foi possível criar estrutura.',
            req.params,
            e.stack 
        )
        res.send(message)
    }
})

export { router as createEstrutura }