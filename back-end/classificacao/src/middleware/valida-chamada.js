import { check } from 'express-validator'

const validaCampos = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
]

const validaParametros = [
    check('org').trim().notEmpty().withMessage('Organização não informada.'),
]

export { validaCampos, validaParametros }