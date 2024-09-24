import { check } from 'express-validator'
import { Usuario } from '../models/usuario.js'
import mongoose from 'mongoose'

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
    const linha = result[0].linhas.length === 0
    const estrutura = result[0].estruturas.length === 0

    return linha || estrutura ?
        Promise.resolve() : 
        Promise.reject(new Error(`Usuário está sendo utilizado em ${result[0].linhas.length} linhas e ${result[0].estruturas.length} estruturas, necessário alterar as linhas antes de excluir.`))
}

const validaUso = [
    check('id').custom(emUso)
]

const emUsoLogin = async (value, { req }) => {
    const result = await Usuario.find({usuario_login: value, usuario_org: req.body.org})

    return result.length === 0 ?
        Promise.resolve() : 
        Promise.reject(new Error('Login já está sendo utilizado por outro usuário.'))
}

const emUsoEmail = async (value, { req }) => {
    const result = await Usuario.find({usuario_email: value, usuario_org: req.body.org})

    return result.length === 0 ?
        Promise.resolve() : 
        Promise.reject(new Error('Email já está sendo utilizado por outro usuário.'))
}

const validaLoginEmail = [
    check('login').custom(emUsoLogin),
    check('email').custom(emUsoEmail)
]

const fieldValidation = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('sobrenome').trim().notEmpty().withMessage('Sobrenome não informado.'),
    check('login').trim().notEmpty().withMessage('Login não informado.'),
    check('senha').trim().notEmpty().withMessage('Senha não informada.'),
    check('email').trim().notEmpty().withMessage('Email não informado.').isEmail().withMessage('Email não é válido'),
    check('perfil').trim().notEmpty().withMessage('Já existe um ciclo ativo.')
]

export { fieldValidation, validaUso, validaLoginEmail }