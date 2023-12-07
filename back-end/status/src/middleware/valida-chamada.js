import { check } from 'express-validator'

const validaCampos = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('entidade').trim().notEmpty().withMessage('Entidade não informada.'),
]

const validaParametros = [
    check('org').trim().notEmpty().withMessage('Organização não informada.'),
]

export { validaCampos, validaParametros }