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
    collection: 'usuario',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.usuario_senha;
            delete ret.__v;
        }
    }
}
)

usuarioSchema.statics.findUsuarios = async function (id) {
    const response = await this.aggregate([
            /** Faz o match para trazer o documento que corresponde ao 'id' informado */
            {
                $match: {
                    usuario_org: new mongoose.Types.ObjectId(id)
                }
            }
            /** Faz o lookup para trazer as informações do perfil */
            ,{
                $lookup: {
                    from: 'perfil',
                    localField: 'usuario_perfil',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'role_name': 1
                            }
                        }
                    ],
                    as: 'perfil',
                }
            }
            /** Faz o lookup para trazer o tipo de despesa */
            ,{
                $lookup: {
                    from: 'situacao',
                    localField: 'usuario_situacao',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'sit_descr': 1
                            }
                        }
                    ],
                    as: 'situacao',
                }
            }
            ,{
                $project: {
                    usuario_senha: 0,
                    __v: 0
                }
            }
    ]).exec()

    return response
}


const Usuario = mongoose.model('usuario', usuarioSchema)

export { Usuario }