import mongoose, { SchemaTypes } from "mongoose"

const estruturaSchema = new mongoose.Schema({
    estrutura_org: mongoose.Types.ObjectId,
    estrutura_cod: String,
    estrutura_descr: String,
    estrutura_parent: SchemaTypes.Mixed,
    estrutura_responsavel: mongoose.Types.ObjectId,
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
    collection: 'estrutura',
    toJSON: {
        transform: function (doc, ret) {
            doc.parent = ret.estrutura_parent
            delete ret.estrutura_parent
        }
    }
})

estruturaSchema.statics.listEstrutura = async function (org) {
    const response = await this.aggregate([
        {
            $match: {
                estrutura_org : new mongoose.Types.ObjectId(org)
            }
        }
        /** Faz o lookup para trazer o responsável principal */
        ,{
            $lookup: {
                from: 'usuario',
                localField: 'estrutura_responsavel',
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
            $addFields: {
              parent: "$estrutura_parent" // Renomeia estrutura_parent para parent
            }
        }
        ,{
            $project: {
                __v: 0,
                createdAt: 0,
                lastModified: 0,
                estrutura_parent: 0
            }
        }
    ]).exec()

    return response
}

const Estrutura = mongoose.model('Estrutura', estruturaSchema)

export { Estrutura }