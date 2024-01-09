import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password.js';
import { Usuario } from '../models/usuario.js';
import { ExecutionMessage, ExecutionStatus, ExecutionTypes, MessageLevel } from '@keeptargets/common'

import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

router.post(
  '/api/users/signin',
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
    
            const existingUser = await Usuario.findOne({ email });
            if (!existingUser) {
              throw new BadRequestError('Invalid credentials');
            }
        
            const passwordsMatch = await Password.compare(
              existingUser.password,
              password
            );
            if (!passwordsMatch) {
              throw new BadRequestError('Invalid Credentials');
            }
        
            // Generate JWT
            const userJwt = jwt.sign(
              {
                id: existingUser.id,
                email: existingUser.email,
              },
              process.env.JWT_KEY
            );
        
            // Store it on session object
            req.session = {
              jwt: userJwt,
            };
        
            res.status(200).send(existingUser);
        } else {
            const message = new ExecutionMessage(
                MessageLevel.LEVEL_WARNING,
                ExecutionStatus.ERROR,
                ExecutionTypes.CREATE,
                'Não foi possível autenticar.',
                req.body,
                result.array()
            )
            res.send(message)
        }
    } catch{
        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.CREATE,
            'Erro ao criar centro de custo.',
            req.params,
            error 
        )
    }
});

export { router as signinRouter }