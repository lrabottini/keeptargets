import mongoose, { Schema, SchemaType } from "mongoose"

const linhaSchema = new mongoose.Schema({
    linha_org: mongoose.Types.ObjectId,
    linha_ciclo: mongoose.Types.ObjectId,
    linha_versao: mongoose.Types.ObjectId,
    linha_classificacao: mongoose.Types.ObjectId,
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

linhaSchema.statics.findLinhas = async function (org, ciclo) {
    const response = await this.aggregate([
            /** Faz o match para trazer o documento que corresponde ao 'id' informado */
            {
                $match: {
                    linha_org : new mongoose.Types.ObjectId(org),
                    linha_ciclo: new mongoose.Types.ObjectId(ciclo)
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
            ,{
                $unwind: {
                    path: '$centro_de_custo',
                    preserveNullAndEmptyArrays: true
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
            ,{
                $unwind: {
                    path: '$tipo_de_despesa',
                    preserveNullAndEmptyArrays: true
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
                                'estrutura_descr': 1
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
            /** Faz o lookup para trazer o proprietario */
            ,{
                $lookup: {
                    from: 'usuario',
                    localField: 'linha_proprietario',
                    foreignField: '_id',
                    let: {
                        usuario_nomeCompleto: {
                            $concat: ["$nomeCompleto", " ", "$usuario_sobrenome"]
                        }
                    },
                    pipeline:[
                        {
                            $project: {
                                usuario_nome: 1,
                                usuario_sobrenome: 1
                            }
                        },
                        {
                            $addFields: {
                              usuario_nomeCompleto: {
                                $concat: ["$usuario_nome", " ", "$usuario_sobrenome"]
                              }
                            }
                        }
                    ],
                    as: 'proprietario'
                }
            }
            ,{
                $unwind: {
                    path: '$proprietario',
                    preserveNullAndEmptyArrays: true
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
                                'fornecedor_nome': 1
                            }
                        }
                    ],
                    as: 'fornecedor',
                }
            }
            ,{
                $unwind: {
                    path: '$fornecedor',
                    preserveNullAndEmptyArrays: true
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
                                'situacao_nome': 1
                            }
                        }
                    ],
                    as: 'etapa',
                }
            }
            ,{
                $unwind: {
                    path: '$etapa',
                    preserveNullAndEmptyArrays: true
                }
            }
            /** Faz o lookup para trazer a versão */
            ,{
                $lookup: {
                    from: 'versao',
                    localField: 'linha_versao',
                    foreignField: '_id',
                    pipeline:[
                        {
                            $project: {
                                'versao_nome': 1
                            }
                        }
                    ],
                    as: 'versao',
                }
            }
            ,{
                $unwind: {
                    path: '$versao',
                    preserveNullAndEmptyArrays: true
                }
            }
            ,{
                $project: {
                    createdAt: 0,
                    lastModified: 0,
                    linha_classificacao: 0,
                    linha_centro_de_custo: 0,
                    linha_tipo_de_despesa: 0,
                    linha_estrutura: 0,
                    linha_proprietario: 0,
                    linha_fornecedor: 0,
                    linha_etapa: 0,
                    linha_versao: 0
                }
            },
    ]).exec()

    return response
}

const Linha = mongoose.model('Linha', linhaSchema)

export { Linha }