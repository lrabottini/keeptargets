import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const curretUser = (req, res, next) => {
    const token = req.cookies.access_token
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY)
            req.currentUser = payload
        } catch (err) {
        }
    }
    
    next()
}