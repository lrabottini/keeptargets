import mongoose from "mongoose"

const usuarioSchema = new mongoose.Schema({
    usuario_org: mongoose.Types.ObjectId,
    usuario_nome: String,
    usuario_sobrenome: String,
    usuario_login: String,
    usuario_senha: String,
    usuario_email: String,
    usuario_perfil: mongoose.Types.ObjectId,
    usuario_situacao: mongoose.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.usuario_senha
        }
    }
},
{collection: 'usuario'})

const Usuario = mongoose.model('usuario', usuarioSchema)

export { Usuario }