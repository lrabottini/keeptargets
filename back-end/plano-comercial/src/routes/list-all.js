import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { PlanoComercial } from '../models/plano-comercial.js'
const router = express.Router()

router.get('/planocomercialall/', async (req, res) => {
    try {
        const planoComercial = await PlanoComercial.find()

        res.send(planoComercial)
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
            ExecutionTypes.LIST,
            'Não foi possível buscar planos.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAll }