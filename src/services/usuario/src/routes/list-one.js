import express from 'express'
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'
import { Usuario } from '../models/usuario.js'

const router = express.Router()

router.get('/usuario/:id', async (req, res) => {
    try {
        await Usuario.findById(req.params.id)
            .then((result) => {
                res.send(result)
            })
            .catch(() => {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Proprietário não encontrada.',
                    req.params,
                    []
                )
                res.send(message)
            })

    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_INFO,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar proprietario.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listOneUsuario }