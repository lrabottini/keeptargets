async function docHierarchy(documentos) {
    let order = 1
    
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
        const result = flattener(mapaPaisFilhos, 'root', 0);

        // Cria campos informando
        // - Se o nó tem algum filho
        // - Descrição para apresentar o item em um dropdowm de forma identada
        // - Prefixo para controlar relação pai e filho
        
        const prefixArray = []
        let prefix = 1

        for (let index = 0; index < result.length; index++){
            if (result.length > index + 1) {
                result[index]['hasChildren'] = result[index+1].parent.toString() === result[index]._id.toString()
                result[index]['ddIdentation'] = result[index].level > 0
                    ? ' '.repeat(result[index].level * 4).concat('|----', result[index].descr)
                    : result[index].descr
            } else {
                result[index]['hasChildren'] = false
                result[index]['ddIdentation'] = result[index].level > 0
                    ? ' '.repeat(result[index].level * 4).concat('|----', result[index].descr)
                    : result[index].descr
            }
                
            if (result[index].parent === 0) {
                prefixArray.push({ key: result[index]._id.toString(), value: prefix})
                result[index]['preffix'] = prefix.toString()
                prefix++
            } else {
                const offset = prefixArray.find(obj => obj.key === result[index].parent.toString())
                result[index]['preffix'] = offset.value.toString().concat(prefix.toString())
                prefixArray.push({ key: result[index]._id.toString(), value: result[index]['preffix']})
            }
        }

        order = 1

        return result
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
    
    // Função recursiva para achatamento da estrutura
    function flattener(mapa, parentId, level) {
        const filhos = mapa[parentId] || [];
        let resultado = [];
        for (const filho of filhos) {
            resultado.push({ ...filho, order, level });
            order = order + 1
            resultado = resultado.concat(flattener(mapa, filho._id, level + 1));
        }
        return resultado;
    }
}

export { docHierarchy }