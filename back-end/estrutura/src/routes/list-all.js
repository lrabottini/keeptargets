import express from 'express'
import { ExecutionMessage, ExecutionTypes, ExecutionStatus, MessageLevel, aplanarEstrutura } from '@keeptargets/common'
import { Estrutura } from '../models/estrutura.js'

const router = express.Router()
let order = 1

async function criarEstruturaHierarquica(documentos) {
    try {
        const mapaPaisFilhos = {};

        // Criar um mapa de pais e filhos
        documentos.forEach(doc => {
            const parentId = doc.parent || 'root';
            if (!mapaPaisFilhos[parentId]) {
                mapaPaisFilhos[parentId] = [];
            }
            mapaPaisFilhos[parentId].push({ ...doc });
        });

        // Achatar a estrutura
        const result = achatador(mapaPaisFilhos, 'root', 0);

        // Cria campos informando
        // - Se o nó tem algum filho
        // - Descrição para apresentar o item em um dropdowm de forma idendata
        // - Prefixo para controlar relação pai e filho
        
        const preffixArray = []
        let prefix = 1

        for (let index = 0; index < result.length; index++){
            if (result.length > index + 1) {
                result[index]['hasChildren'] = result[index+1].parent.toString() === result[index]._id.toString()
                result[index]['ddIdentation'] = result[index].level > 0
                    ? ' '.repeat(result[index].level * 4).concat('|----', result[index].descr)
                    : result[index].descr
            }
            
            if (result[index].parent === 0) {
                preffixArray.push({ key: result[index]._id.toString(), value: prefix})
                result[index]['preffix'] = prefix.toString()
                prefix++
            } else {
                const offset = preffixArray.find(obj => obj.key === result[index].parent.toString())
                result[index]['preffix'] = offset.value.toString().concat(prefix.toString())
                preffixArray.push({ key: result[index]._id.toString(), value: result[index]['preffix']})
            }
        }

        order = 1

        return result
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
    
}

// Função recursiva para achatamento da estrutura
function achatador(mapa, parentId, level) {
    const filhos = mapa[parentId] || [];
    let resultado = [];
    for (const filho of filhos) {
        resultado.push({ ...filho, order, level });
        order = order + 1
        resultado = resultado.concat(achatador(mapa, filho._id, level + 1));
    }
    return resultado;
}
    
router.get('/estrutura/all/:org', async (req, res) => {
    try {
        // const estrutura = await Estrutura.returnTree(req.params.org)
        // const estruturaAplanada = aplanarEstrutura(estrutura)

        const estrutura = await Estrutura.listEstrutura(req.params.org)
        const estruturaAplanada = await criarEstruturaHierarquica(estrutura)
        
        res.send(estruturaAplanada)
    } catch (e) {
        const error = [{
            type: e.name,
            value: '',
            msg: e.message,
            path: e.stack,
            location: ''
        }]

        const message = new ExecutionMessage(
            MessageLevel.LEVEL_ERROR,
            ExecutionStatus.ERROR,
            ExecutionTypes.LIST,
            'Erro ao buscar estrutura.',
            req.params,
            error 
        )
        res.send(message)
    }
})

export { router as listAllEstrutura }