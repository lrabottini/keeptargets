import { check } from 'express-validator'

const checkAuthentication = (value, { req }) => {
    return req.session.jwt
}

const requireAuth = [
    h check('currentuser').custom(checkAuthentication).withMessage('Não autorizado.')
]

export { requireAuth }