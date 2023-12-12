import { check } from 'express-validator'
import { Usuario } from '../models/usuario.js'

/** Valida se o login já está em uso */

/** Valida se o email já está em uso */

/** Valida se organização foi informada */
const hasOrg = [
    check('org').trim().notEmpty().withMessage('Organização não informada.')
]

/** Valida se o usuário é proprietário de alguma entidade */
const emUso = async (value, { req }) => {
    const result = await Usuario.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(value)
            }
        }
        /** Faz o lookup para trazer as informações da linha */
        ,{
            $lookup: {
                from: 'linha',
                localField: '_id',
                foreignField: 'linha_centro_de_custo',
                as: 'linhas',
            }
        }
        /** Faz o lookup para trazer as informações da estrutura */
        ,{
            $lookup: {
                from: 'estrutura',
                localField: '_id',
                foreignField: 'estrutura_responsavel',
                as: 'estruturas',
            }
        }
    ]).exec()
    
    /** Caso o centro de custo não esteja em uso, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result[0].linhas.length === 0?
        Promise.resolve() : 
        Promise.reject(new Error('Usuário está sendo utilizado, necessário alterar as linhas antes de excluir.'))
}

const validaUso = [
    check('id').custom(emUso)
]

const fieldValidation = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('sobrenome').trim().notEmpty().withMessage('Sobrenome não informado.'),
    check('login').trim().notEmpty().withMessage('Login não informado.'),
    check('senha').trim().notEmpty().withMessage('Senha não informada.'),
    check('email').trim().notEmpty().withMessage('Email não informado.').isEmail().withMessage('Email não é válido'),
    check('perfil').trim().notEmpty().withMessage('Já existe um ciclo ativo.')
]

export { fieldValidation, validaUso }