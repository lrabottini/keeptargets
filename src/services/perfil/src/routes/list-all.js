import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Perfil } from '../models/perfil.js'

const router = express.Router()

router.get('/perfil/all/:org', async (req, res) => {
    try {
        const perfil = await Perfil.find({perfil_org: req.params.org})

        res.send(perfil)
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
            'Não foi possível listar perfis.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllPerfil }