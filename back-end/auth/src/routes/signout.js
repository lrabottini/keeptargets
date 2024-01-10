import express from 'express';
import { curretUser } from '../middleware/current-user.js';
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

const router = express.Router();

router.get('/api/v1/auth/signout', (req, res) => {
    try {
        req.session = null
        
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_INFO,
            ExecutionStatus.SUCCESS,
            ExecutionTypes.CREATE,
            'Usuário desconectado com sucesso.',
            {},
            {}
        )

        res.status(200).send(message);
    } catch(e){
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
            'Não foi possível autenticar usuário.',
            req.params,
            error 
        )
        res.status(500).send(message)
    }
});

export { router as signoutRouter };
