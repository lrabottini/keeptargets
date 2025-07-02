//#region Importar arquivo de fornecedores 
// const csvUrl = "https://eac4a068e4204eb9ff7fabb57261883a.cdn.bubble.io/f1749820260470x909498741278246000/cnpjs_ficticios%20-%20cnpjs_ficticios.csv.csv?_gl=1*u5in5e*_gcl_au*MjQ5Nzk0OTkxLjE3NDg1NDE3NDA.*_ga*MzY4MTAzOTE3LjE3NDA3NTY2MjM.*_ga_BFPVR2DEE2*czE3NDk3OTM4NDQkbzgwJGcxJHQxNzQ5ODIwMzU1JGo1MSRsMCRoMA.."
// const cnpjsCadastrados = [""]; // Substitua por sua fonte dinâmica do Bubble

// function formatarCNPJ(cnpj) {
//     const apenasNumeros = cnpj.replace(/\D/g, '');
//     if (apenasNumeros.length !== 14) return null;
//     return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2, 5)}.${apenasNumeros.slice(5, 8)}/${apenasNumeros.slice(8, 12)}-${apenasNumeros.slice(12)}`;
// }

// function validarCNPJ(cnpj) {
//     cnpj = cnpj.replace(/[^\d]+/g, '');

//     if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

//     const calcDigito = (cnpjBase, pesos) => {
//         let soma = 0;
//         for (let i = 0; i < pesos.length; i++) {
//             soma += parseInt(cnpjBase[i]) * pesos[i];
//         }
//         const resto = soma % 11;
//         return resto < 2 ? 0 : 11 - resto;
//     };

//     const base = cnpj.slice(0, 12);
//     const dig1 = calcDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
//     const dig2 = calcDigito(base + dig1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

//     return cnpj === base + dig1.toString() + dig2.toString();
// }

// // Lista com CNPJs já cadastrados (formatados com pontuação)

// fetch(csvUrl)
//     .then(response => response.text())
//     .then(csvText => {
//         const lines = csvText.trim().split('\n');

//         const processedLines = lines.map((line, index) => {
//             const columns = line.split(',');

//             if (columns.length > 2) {
//                 const cnpjOriginal = columns[2].trim(); // Remover espaços e quebras
//                 const cnpjNumerico = cnpjOriginal.replace(/\D/g, '');

//                 const cnpjValido = validarCNPJ(cnpjNumerico);
//                 const cnpjFormatado = cnpjValido ? formatarCNPJ(cnpjNumerico) : null;

//                 if (cnpjValido && cnpjFormatado) {
//                     columns[2] = cnpjFormatado;

//                     if (cnpjsCadastrados.includes(cnpjFormatado)) {
//                         columns.push("Fornecedor já cadastrado");
//                     }
//                 } else {
//                     columns.push("CNPJ inválido");
//                 }
//             }

//             return columns.join(',');
//         });

//         //bubble_fn_fornecedorFile(processedLines);
//     })
//     .catch(error => {
//         console.error("Erro ao baixar CSV:", error);
//     });
//#endregion

//#region Importar arquiov de estruturas
const csvUrl = "https://eac4a068e4204eb9ff7fabb57261883a.cdn.bubble.io/f1750041239002x759186293921987700/estrutura_20250615_23_15_23.csv?_gl=1*hu30tv*_gcl_au*MjQ5Nzk0OTkxLjE3NDg1NDE3NDA.*_ga*MzY4MTAzOTE3LjE3NDA3NTY2MjM.*_ga_BFPVR2DEE2*czE3NTAwMzY5NjMkbzg0JGcxJHQxNzUwMDQxNzQ4JGo1OCRsMCRoMA.."
const responsaveis = ["BUGS BUNNY"];
const valores = [",CEO", ",DIRETORIA DE ANIMAÇÃO", ",DIRETORIA DE DUBLAGEM", ",DIRETORIA DE EFEITOS ESPECIAIS", ",GER ANIMAÇÃO 2D", ",GER ANIMAÇÃO 3D", ",SQUAD RENDERIZAÇÃO", ",GER DUBLAGEM 1", ",GER DUBLAGEM 2"]

const referencias = []
const estruturas = []

valores.forEach(item => {
    const [primeiro, segundo] = item.split(",");
    referencias.push(primeiro.trim());
    estruturas.push(segundo.trim());
});

console.log(valores)
console.log(referencias)
console.log(estruturas)

fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
        const lines = csvText.trim().split('\n');
        const processedLines = lines.map((line, index) => {
            const columns = line.split(',');
            let obs = ""

            if (columns.length > 2) {
                if (!responsaveis.includes(columns[4]))
                    obs = obs + "Responsável não está cadastrado na base\n"
                if (referencias.includes(columns[0]) && columns[0] !== "")
                    obs = obs + "Referência já está cadastrada\n"
                if (estruturas.includes(columns[3]))
                    obs = obs + "Estrutura já está cadastrada\n"
            }

            columns.push(obs)
            return columns.join(',');
        });
        
        bubble_fn_estruturaFile(processedLines); // ou console.log(lines);
    })
    .catch(error => {
        console.error("Erro ao baixar CSV:", error);
    });
//#endregion