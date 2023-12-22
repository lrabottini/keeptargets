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

        // Identifica se o parent tem algum filho
        for (let index = 0; index < result.length-1; index++){
            let element = result[index]
            
            const hasChildren = result[index+1].parent.toString() === result[index]._id.toString()

            element['hasChildren'] = hasChildren
            result[index] = element
        }
        result[result.length-1]['hasChildren'] = false

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