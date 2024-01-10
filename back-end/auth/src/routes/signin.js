import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password.js';
import { Usuario } from '../models/usuario.js';
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

router.get(
    '/api/v1/auth/signin',
    // [
    //     body('email').isEmail().withMessage('Email must be valid'),
    //     body('password')
    //         .trim()
    //         .notEmpty()
    //         .withMessage('You must supply a password'),
    // ],
    async (req, res) => {
        try {
            const result = validationResult(req)
            if (result.isEmpty()){
                const { email, password } = req.body;
        
                const existingUser = await Usuario.findOne({ usuario_email: email });
                if (!existingUser) {
                    throw new Error('Invalid credentials');
                }
            
                const passwordsMatch = await Password.compare(
                    existingUser.usuario_senha,
                    password
                )

                if (!passwordsMatch) {
                    throw new Error('Invalid Credentials');
                }
            
                // Generate JWT
                const userJwt = jwt.sign(
                    {
                        id: existingUser.id,
                        email: existingUser.usuario_email,
                    },
                    process.env.JWT_KEY
                );
            
                // Store it on session object
                req.session = {
                    jwt: userJwt,
                };

                // res.cookie("access_token", userJwt, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === "prod",
                // })

                const message = new ExecutionMessage(
                    MessageLevel.LEVEL_INFO,
                    ExecutionStatus.SUCCESS,
                    ExecutionTypes.CREATE,
                    'Usuário autenticado com sucesso.',
                    existingUser,
                    {}
                )

                res.status(200).send(message);
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
            res.status(500).send(message)
        }
});

export { router as signinRouter }