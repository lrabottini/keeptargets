import mongoose from "mongoose"

const organizacaoSchema = new mongoose.Schema({
    organizacao_nome: String,
    organizacao_cnpj: String,
    organizacao_situacao: mongoose.Types.ObjectId,
    organizacao_plano:  mongoose.Types.ObjectId,
    organizacao_data_expiração: Date,
    organizacao_responsavel:  mongoose.Types.ObjectId,
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
    collection: 'organizacao',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt
            delete ret.lastModified
        }
    }
})

organizacaoSchema.statics.listOrgs = async function () {
    const response = await this.aggregate([
            /** Faz o lookup para trazer a situação */
            {
                $lookup: {
                    from: 'situacao',
                    localField: 'organizacao_situacao',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'situacao_nome': 1,
                                'situacao_cor': 1
                            }
                        }
                    ],
                    as: 'situacao',
                }
            }
            /** Faz o lookup para trazer o responsável principal */
            ,{
                $lookup: {
                    from: 'usuario',
                    localField: 'organizacao_responsavel',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'usuario_nome': 1,
                                'usuario_sobrenome': 1
                            }
                        }
                    ],
                    as: 'usuario',
                }
            }
            ,{
                $project: {
                    lastModified: 0,
                    usuario_senha: 0,
                    organizacao_situacao: 0,
                    organizacao_responsavel: 0,
                    __v: 0
                }
            }
    ]).exec()

    return response
}

const Organizacao = mongoose.model('Organizacao', organizacaoSchema)

export { Organizacao }