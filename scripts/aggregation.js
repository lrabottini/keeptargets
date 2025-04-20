function processBubbleLists(list1, list2, groupByIndex, subtractIndices) {
    // Converte as listas de strings para arrays de valores separados por ";"
    const parseList = list => list.map(item => item.split(";"));

    const list1Parsed = parseList(list1);
    const list2Parsed = parseList(list2);

    // Junta as duas listas
    const combinedList = [...list1Parsed, ...list2Parsed];

    // Agrupa por uma posição específica
    const grouped = combinedList.reduce((acc, item) => {
        const key = item[groupByIndex];
        if (!acc[key]) {
            acc[key] = { baseRow: [...item], sums: Array(item.length).fill(0) };
        }
        // Soma os campos usados para cálculo (nas posições de subtração)
        subtractIndices.forEach(index => {
            acc[key].sums[index] += parseFloat(item[index]) || 0;
        });
        return acc;
    }, {});

    // Gera a lista final
    const finalList = Object.values(grouped)
        .map(({ baseRow, sums }) => {
            // Substitui os valores originais pelas somas calculadas
            subtractIndices.forEach(index => {
                baseRow[index] = sums[index];
            });

            // Calcula a subtração: posição 1 - posição 2 - posição 3
            const value1 = sums[subtractIndices[0]] || 0;
            const value2 = sums[subtractIndices[1]] || 0;
            const value3 = sums[subtractIndices[2]] || 0;
            const subtractionResult = value1 - value2 - value3;

            // Retorna somente se o resultado for maior que 0
            if (subtractionResult > 0) {
                baseRow.push(subtractionResult.toFixed(2)); // Adiciona o resultado como último valor
                return baseRow.join(";"); // Retorna a linha como string com valores separados por ";"
            }
            return null;
        })
        .filter(row => row !== null); // Remove entradas nulas

    // Retorna o resultado como um array de strings
    return finalList;
}

const list1Str = [
    "SQUAD MOBILE;SERVIÇOS CLOUD;DESPESA DE PESSOAL;BRUNA BATISTA;52083.33;200000;0;1713759624417x429432480979222500",
    "GER CONTÁBIL;HOTEL XYZ;DESPESA DE VIAGEM;LUIZ LIMAS;7125;7083.33;0;1713813873657x197476378502758400",
    "GER ENGENHARIA DE SOFTWARE;SERVIÇOS CLOUD;LICENÇA DE SOFTWARE;ELISABETH ELIAS;104166.67;0;0;1715173117377x252162222510309380"]
const list2Str = [`GER PRODUTOS DIGITAIS;SERVIÇOS CLOUD;DESPESA DE PESSOAL;ANA APARECIDA;0;0;4603.69;1714071775597x842925126945079300`];

// const list1Str = properties.paramlist1.get(0, properties.paramlist1.length())
// const list2Str = properties.paramlist2.get(0, properties.paramlist2.length())

const groupByIndex = 7; // Agrupar pelo índice 7
const subtractIndices = [4, 5, 6]; // Subtrair as posições 4, 5 e 6

const result = processBubbleLists(list1Str, list2Str, groupByIndex, subtractIndices);

bubble_fn_saldos(result)

// Exemplo de como usar:
// const list1Str = [
//     ["SQUAD MOBILE;SERVIÇOS CLOUD;DESPESA DE PESSOAL;BRUNA BATISTA;52083.33;200000;0;1713759624417x429432480979222500"],
//     ["GER CONTÁBIL;HOTEL XYZ;DESPESA DE VIAGEM;LUIZ LIMAS;7125;7083.33;0;1713813873657x197476378502758400"],
//     ["GER ENGENHARIA DE SOFTWARE;SERVIÇOS CLOUD;LICENÇA DE SOFTWARE;ELISABETH ELIAS;104166.67;0;0;1715173117377x252162222510309380"]
// ] 
// const list2Str = [`GER PRODUTOS DIGITAIS;SERVIÇOS CLOUD;DESPESA DE PESSOAL;ANA APARECIDA;0;0;4603.69;1714071775597x842925126945079300`];
// const list1Str = properties.paramlist1.get(0, properties.paramlist1.length())
// const list2Str = properties.paramlist2.get(0, properties.paramlist2.length())

