function filterByDateRange(stringList, startDate, endDate) {
    // Convertemos as datas de início e fim para objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filtramos a lista
    const filteredList = stringList.filter(item => {
        const parts = item.split(';'); // Dividimos a string
        const month = parseInt(parts[1], 10); // Número do mês
        const year = parseInt(parts[2], 10); // Ano
        const date = new Date(year, month - 1); // Criamos o objeto Date

        // Verificamos se a data está dentro do intervalo
        return date >= start && date <= end;
    });

    return filteredList;
}

// Exemplo de uso:
const originalList = [
    "Outubro;10;2024;1",
    "Novembro;11;2024;2",
    "Dezembro;12;2024;3",
    "Janeiro;1;2025;4",
    "Fevereiro;2;2025;5"
];

const startDate = "2024-11-01"; // Data de início no formato YYYY-MM-DD
const endDate = "2025-01-31";   // Data de fim no formato YYYY-MM-DD

const result = filterByDateRange(originalList, startDate, endDate);
console.log(result); // Saída: ["Novembro;11;2024;2", "Dezembro;12;2024;3", "Janeiro;1;2025;4"]
