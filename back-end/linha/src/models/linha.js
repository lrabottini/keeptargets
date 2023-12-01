import mongoose, { Schema, SchemaType } from "mongoose"

const linhaSchema = new mongoose.Schema({
    linha_versao: mongoose.Types.ObjectId,
    linha_classificacao: String,
    linha_centro_de_custo: mongoose.Types.ObjectId,
    linha_tipo_de_despesa: mongoose.Types.ObjectId,
    linha_estrutura: mongoose.Types.ObjectId,
    linha_proprietario: mongoose.Types.ObjectId,
    linha_fornecedor: mongoose.Types.ObjectId,
    linha_descricao: String,
    linha_inicio_periodo: Date,
    linha_fim_periodo: Date,
    linha_valor_base: Number,
    linha_reajuste: {
        tipo_reajuste: {
            type: String,
            default: "VALOR"
        },
        reajuste_valor: {
            type: Number,
            default: 0
        },
        reajuste_percentual: {
            type: mongoose.Types.Decimal128,
            default: 0
        }
    },
    linha_valor_final: {
        valor_final_valor: {
            type: Number,
            default: 0
        },
        valor_final_perc: {
            type: Number,
            default: 0
        }
    },
    linha_etapa: mongoose.Types.ObjectId,
    linha_observacao: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'linha'})

linhaSchema.statics.findLinha = async function (id) {
    const response = await this.aggregate([
            /** Faz o match para trazer o documento que corresponde ao 'id' informado */
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
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
                                'centrocusto_descr': 1
                            }
                        }
                    ],
                    as: 'centro_de_custo',
                }
            }
            /** Faz o lookup para trazer o tipo de despesa */
            ,{
                $lookup: {
                    from: 'tipo_de_despesa',
                    localField: 'linha_tipo_de_despesa',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'tipodespesa_descr': 1
                            }
                        }
                    ],
                    as: 'tipo_de_despesa',
                }
            }
            /** Faz o lookup para trazer a estrutura */
            ,{
                $lookup: {
                    from: 'estrutura',
                    localField: 'linha_estrutura',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'estrut_descr': 1
                            }
                        }
                    ],
                    as: 'estrutura',
                }
            }
            /** Faz o lookup para trazer o proprietario */
            ,{
                $lookup: {
                    from: 'proprietario',
                    localField: 'linha_proprietario',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'prop_nome': 1
                            }
                        }
                    ],
                    as: 'proprietario',
                }
            }
            /** Faz o lookup para trazer as informações do fornecedor */
            ,{
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
            /** Faz o lookup para trazer a etapa */
            ,{
                $lookup: {
                    from: 'situacao',
                    localField: 'linha_etapa',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'sit_descr': 1
                            }
                        }
                    ],
                    as: 'etapa',
                }
            }
            ,{
                $project: {
                    linha_centro_de_custo: 0,
                    linha_tipo_de_despesa: 0,
                    linha_estrutura: 0,
                    linha_proprietario: 0,
                    linha_fornecedor: 0,
                    linha_etapa: 0
                }
            }
    ]).exec()
    return response[0]
}

linhaSchema.statics.findLinhas = async function (id) {
    const response = await this.aggregate([
            /** Faz o match para trazer o documento que corresponde ao 'id' informado */
            {
                $match: {
                    linha_versao: new mongoose.Types.ObjectId(id)
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
                                'centrocusto_descr': 1
                            }
                        }
                    ],
                    as: 'centro_de_custo',
                }
            }
            /** Faz o lookup para trazer o tipo de despesa */
            ,{
                $lookup: {
                    from: 'tipo_de_despesa',
                    localField: 'linha_tipo_de_despesa',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'tipodespesa_descr': 1
                            }
                        }
                    ],
                    as: 'tipo_de_despesa',
                }
            }
            /** Faz o lookup para trazer a estrutura */
            ,{
                $lookup: {
                    from: 'estrutura',
                    localField: 'linha_estrutura',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'estrut_descr': 1
                            }
                        }
                    ],
                    as: 'estrutura',
                }
            }
            /** Faz o lookup para trazer o proprietario */
            ,{
                $lookup: {
                    from: 'proprietario',
                    localField: 'linha_proprietario',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'prop_nome': 1
                            }
                        }
                    ],
                    as: 'proprietario',
                }
            }
            /** Faz o lookup para trazer as informações do fornecedor */
            ,{
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
            /** Faz o lookup para trazer a etapa */
            ,{
                $lookup: {
                    from: 'situacao',
                    localField: 'linha_etapa',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'sit_descr': 1
                            }
                        }
                    ],
                    as: 'etapa',
                }
            }
            // ,{
            //     $project: {
            //         linha_versao: 0,
            //         linha_centro_de_custo: 0,
            //         linha_tipo_de_despesa: 0,
            //         linha_estrutura: 0,
            //         linha_proprietario: 0,
            //         linha_fornecedor: 0,
            //         linha_etapa: 0
            //     }
            // }
    ]).exec()

    return response
}

const Linha = mongoose.model('Linha', linhaSchema)

export { Linha }