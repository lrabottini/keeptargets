import mongoose, { SchemaTypes } from "mongoose"

const estruturaSchema = new mongoose.Schema({
    estrutura_org: mongoose.Types.ObjectId,
    estrutura_cod: String,
    estrutura_descr: String,
    estrutura_parent: SchemaTypes.Mixed,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    lastModified: {
        type: Date,
        default: Date.now()
    },
}, {collection: 'estrutura'})

estruturaSchema.statics.returnTree = async function (id) {
    const response = await this.aggregate([
        {
            $match: {
                estrutura_org : new mongoose.Types.ObjectId(id),
                estrutura_parent: 0
            }
        }
        ,{
            $graphLookup: {
                from: 'estrutura',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'estrutura_parent',
                depthField: "level",
                as: 'children'
            }
        }
        ,{
            $unwind: {
              path: "$children",
              preserveNullAndEmptyArrays: true,
              includeArrayIndex: "index"
            }
        }
        ,{
            $sort: {
                "children.level": -1
            }
        }    
        ,{
            $group: {
                _id: "$_id",
                estrutura_parent: { $first: "$estrutura_parent" },
                estrutura_descr: { $first: "$estrutura_descr" },
                estrutura_cod: { $first: "$estrutura_cod" },
                estrutura_org: { $first: "$estrutura_org" },
                children: { $push: "$children" }
            }
        }
        ,{
            $addFields: {
                children: {
                    $reduce: {
                        input: "$children",
                        initialValue: { level: -1, presentChild: [], prevChild: [] },
                        in: {
                            $let: {
                                vars: {
                                    prev: {
                                        $cond: [
                                            { 
                                                $eq: ["$$value.level", "$$this.level"]
                                            },
                                            "$$value.prevChild",
                                            "$$value.presentChild"
                                        ]
                                    },
                                    current: {
                                        $cond: [
                                            { 
                                                $eq: ["$$value.level", "$$this.level"]
                                            },
                                            "$$value.presentChild",
                                            []
                                        ]
                                    }
                                },
                                in: {
                                    level: "$$this.level",
                                    prevChild: "$$prev",
                                    presentChild: {
                                        $concatArrays: [
                                            "$$current",
                                            [
                                                {
                                                    $mergeObjects: [
                                                        "$$this",
                                                        {
                                                            children: {
                                                                $filter: {
                                                                    input: "$$prev",
                                                                    as: "e",
                                                                    cond: {
                                                                        $eq: ["$$e.estrutura_parent", "$$this._id"]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                children: "$children.presentChild"
            }
        },
        {
            $sort: {
                "level": 1,
                "_id": 1
            }

        }
    ])        
    
    return response
}

const Estrutura = mongoose.model('Estrutura', estruturaSchema)

export { Estrutura }