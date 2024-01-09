import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const UserPayload = {
    id: String,
    email: String
}

export const curretUser = (req, res, next) => {
    if (!(req).session?.jwt) {
        return next()
    }

    try {
        const payload = UserPayload(jwt.verify((req).session.jwt, process.env.JWT_KEY))
        req.currentUser = payload
    } catch (err) {}

    next()
}