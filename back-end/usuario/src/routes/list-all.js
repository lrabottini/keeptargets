import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel } from '@keeptargets/common'
import { Usuario } from '../models/usuario.js'

const router = express.Router()

router.get('/usuario/all/:org', async (req, res) => {
    try {
        //const usuario = await Usuario.find({usuario_org: req.params.org})
        const usuario = await Usuario.findUsuarios(req.params.org)

        res.send(usuario)
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
            'Erro ao buscar usuário.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllUsuario }