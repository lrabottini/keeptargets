import mongoose from "mongoose"

const cicloSchema = new mongoose.Schema({
    ciclo_org: mongoose.Types.ObjectId,
    ciclo_name: String,
    ciclo_start: Date,
    ciclo_end: Date,
    ciclo_situacao: mongoose.Types.ObjectId,
    ciclo_versoes: {
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
}, {collection: 'ciclo'})

cicloSchema.statics.listaCiclos = async function (id) {
    const response = await this.aggregate([
        {
            $match: {
                ciclo_org : new mongoose.Types.ObjectId(id),
            }
        }
        /** Faz o lookup para trazer a situação */
        ,{
            $lookup: {
                from: 'situacao',
                localField: 'ciclo_situacao',
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
        ,{
            $project: {
                lastModified: 0,
                __v: 0,
                createdAt: 0,
                ciclo_situacao: 0
            }
        }
    ]).exec()

    return response
}

const Ciclo = mongoose.model('Ciclo', cicloSchema)

export { Ciclo }