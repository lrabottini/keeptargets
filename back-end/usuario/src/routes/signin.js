import express from 'express';
import { validationResult } from 'express-validator'
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password.js';
import { Usuario } from '../models/usuario.js';
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

router.post(
  '/api/v1/usuario/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.isEmpty()){
            const { email, password } = req.body;
    
            const existingUser = await Usuario.findOne({ usuario_email: email });
            if (!existingUser) {
                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.ERROR,
                    ExecutionTypes.LIST,
                    'Usuário não encontrado.',
                    email,
                    {}
                )
                res.status(404).send(message)
            } else {
                const passwordsMatch = await Password.compare(
                    existingUser.usuario_senha,
                    password
                );
                if (!passwordsMatch) {
                    const message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.ERROR,
                        ExecutionTypes.LIST,
                        'Senha não confere.',
                        {},
                        {}
                    )
                    res.status(404).send(message)
                } else {
                    // Generate JWT
                    const userJwt = jwt.sign(
                        {
                            id: existingUser.id,
                            email: existingUser.email,
                        },
                        process.env.JWT_KEY
                    );
                
                    // Store it on session object
                    req.session = {jwt: userJwt};
                
                    const message = new ExecutionMessage(
                        MessageLevel.LEVEL_INFO,
                        ExecutionStatus.SUCCESS,
                        ExecutionTypes.LIST,
                        'Usuário autenticado com sucesso.',
                        existingUser,
                        result.array()
                    )
                    res.send(message)
                }
            }
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível autenticar usuário.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch (e){
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
        res.send(message)
    }
});

export { router as signinRouter }