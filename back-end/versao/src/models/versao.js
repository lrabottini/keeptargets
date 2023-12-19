import mongoose, { SchemaTypes } from "mongoose"

const versaoSchema = new mongoose.Schema({
    versao_org: mongoose.Types.ObjectId,
    versao_ciclo: mongoose.Types.ObjectId,
    versao_responsavel: mongoose.Types.ObjectId,
    versao_estrutura: mongoose.Types.ObjectId,
    versao_nome: String,
    versao_situacao: {
        situacao_id: mongoose.Types.ObjectId,
        situacao_nome: String,
        situacao_cor: String
    },
    versao_linhas: {
        type: Number,
        default: 0
    },
    versao_valor_total: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {
    collection: 'versao',
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt
            delete ret.lastModified
        }
    }
})

versaoSchema.statics.listVersao = async function (org, ciclo) {
    const response = await this.aggregate([
        {
            $match: {
                versao_org : new mongoose.Types.ObjectId(org),
                versao_ciclo: new mongoose.Types.ObjectId(ciclo)
            }
        },
        /** Faz o lookup para trazer a estrutura */
        {
            $lookup: {
                from: 'estrutura',
                localField: 'versao_estrutura',
                foreignField: '_id',
                pipeline:[
                    {
                        $project: {
                            'estrutura_descr': 1,
                        }
                    }
                ],
                as: 'estrutura',
            }
        }
        ,{
            $unwind: {
                path: '$estrutura',
                preserveNullAndEmptyArrays: true
            }
        }
        /** Faz o lookup para trazer o responsável principal */
        ,{
            $lookup: {
                from: 'usuario',
                localField: 'versao_responsavel',
                foreignField: '_id',
                pipeline:[
                    {
                        $project: {
                            'usuario_nomecompleto': {
                                $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
                            }
                        }
                    }
                ],
                as: 'responsavel',
            }
        }
        ,{
            $unwind: {
                path: '$responsavel',
                preserveNullAndEmptyArrays: true
            }
        }
        ,{
            $project: {
                __v: 0,
                createdAt: 0,
                lastModified: 0
                }
        }
    ]).exec()

    return response
}

const Versao = mongoose.model('Versao', versaoSchema)

export { Versao }