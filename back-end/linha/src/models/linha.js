import mongoose, { Schema, SchemaType } from "mongoose"

const linhaSchema = new mongoose.Schema({
    linha_versao: mongoose.Types.ObjectId,
    linha_fornecedor: mongoose.Types.ObjectId,
    linha_centro_de_custo: mongoose.Types.ObjectId,
    linha_tipo_de_despesa: mongoose.Types.ObjectId,
    linha_inicio_periodo: Date,
    linha_fim_periodo: Date,
    linha_valor_anterior: Schema.Types.Mixed,
    linha_valor: mongoose.Types.Decimal128,
    linha_tipo_reajuste: Number,
    linha_valor_reajuste: mongoose.Types.Decimal128,
    linha_situacao: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'linha'})

// linhaSchema.statics.findCupons = async function (prop) {
//     const response = await this.aggregate([
//             /** Faz o match para trazer o documento que corresponde ao 'id' informado */
//             {
//                 $match: {
//                     proprietario: Number(prop)
//                 }
//             }
//             /** Faz o lookup para trazer as informações do estabelecimento */
//             // TODO - emissor deve retornar apenas um resultado ao inves de um array de resultados.
//             ,{
//                 $lookup: {
//                     from: 'estabelecimentos',
//                     localField: 'emissor',
//                     foreignField: '_id',
//                     pipeline:[
//                         {
//                             $project: {
//                                 'razao_social': 1
//                             }
//                         }
//                     ],
//                     as: 'emissor',
//                 }
//             }
//             ,{
//                 $project: {
//                     criado_em: 0,
//                     itens_cupom: 0
//                 }
//             }
//     ]).exec()
//     return response
// }

linhaSchema.statics.findLinhas = async function (id) {
    const response = await this.aggregate([
            /** Faz o match para trazer o documento que corresponde ao 'id' informado */
            // {
            //     $match: {
            //         _id: new mongoose.Types.ObjectId(id)
            //     }
            // }
            // /** Faz o lookup para trazer as informações do fornecedor */
            {
                $lookup: {
                    from: 'fornecedor',
                    localField: 'linha_fornecedor',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'forn_descr': 1
                            }
                        }
                    ],
                    as: 'fornecedor',
                }
            }
            /** Faz o lookup para trazer as informações do centro de custo */
            ,{
                $lookup: {
                    from: 'centro_de_custo',
                    localField: 'linha_centro_de_custo',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'cc_descr': 1
                            }
                        }
                    ],
                    as: 'centro_de_custo',
                }
            }
            /** Faz o lookup para trazer as informações do tipo de despesa */
            ,{
                $lookup: {
                    from: 'tipo_de_despesa',
                    localField: 'linha_tipo_de_despesa',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'despesa_descr': 1
                            }
                        }
                    ],
                    as: 'tipo_de_despesa',
                }
            }
            ,{
                $project: {
                    lastModified: 0,
                    linha_versao: 0,
                    linha_fornecedor: 0,
                    linha_centro_de_custo: 0,
                    linha_tipo_de_despesa: 0,
                    linha_tipo_reajuste: 0,
                    linha_valor_reajuste: 0
                }
            }
    ]).exec()
    return response[0]
}


const Linha = mongoose.model('Linha', linhaSchema)

export { Linha }