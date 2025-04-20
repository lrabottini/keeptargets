const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Cria o cliente S3 com as credenciais e região necessárias
const s3Client = new S3Client({
  region: 'sa-east-1', // Substitua pela sua região
});

exports.handler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                mensagem: 'O corpo da requisição está ausente.',
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Permite CORS
            },
        };
    }

    try {
        const { fileName, fileType } = JSON.parse(event.body);

        // Verifica se o tipo de arquivo é PDF
        if (fileType !== 'application/pdf') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    fileName: fileName,
                    fileUrl: null,
                    contexto: '',
                    mensagem: 'Tipo de arquivo inválido',
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", // Permite CORS
                },
            };
        }

        // Obtém o nome do bucket a partir da variável de ambiente
        let bucketName = process.env.S3_BUCKET_NAME;

        // Remove qualquer prefixo "s3://" do nome do bucket, se presente
        if (bucketName.startsWith('s3://')) {
            bucketName = bucketName.slice(5); // Remove "s3://"
        }

        // Parâmetros para o upload do arquivo no S3
        const folderPath = process.env.S3_FOLDER; // Simulando uma "pasta" no S3
        const key = folderPath + fileName; // Combina a "pasta" e o nome do arquivo

        // Cria o comando PutObject para o S3
        const params = {
            Bucket: bucketName,
            Key: key, // O nome do arquivo será usado como chave
            ContentType: fileType, // Tipo de conteúdo (application/pdf)
        };

        // Cria o comando PutObject
        const command = new PutObjectCommand(params);

        // Gera a URL pré-assinada para o upload do arquivo
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Verifique se a URL foi gerada corretamente
        if (!url) {
            throw new Error('A URL pré-assinada não foi gerada corretamente.');
        }

        // Retorna a URL pré-assinada gerada para o cliente
        return {
            statusCode: 200,
            body: JSON.stringify({
                presignedUrl: url, // Retorna a URL pré-assinada
                fileUrl: `https://${bucketName}.s3.amazonaws.com/${key}`, // Retorna o caminho acessível para o arquivo
                fileName: fileName, // Nome do arquivo,
                contexto: '',
                mensagam: 'Arquivo carregado com sucesso.', // Status de sucesso
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Permite CORS
            },
        };
    } catch (error) {
        console.error('Erro no processamento:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                mensagem: 'Erro interno no servidor.',
                error: error.message,
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Permite CORS
            },
        };
    }
};