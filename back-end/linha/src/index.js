import { app } from "./app.js";

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const start = async () => {
    if (!process.env.PORT) {
        throw new Error('A porta precisa ser definida.');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('A string de conexão com o MongoDB precisa ser definida.');
    }

    try {
        /** MongoDB Atlas */
        const options = {
            bufferCommands: false,
            autoCreate: false,
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        process.stdout.write('Conectado com sucesso ao MongoDB.\n')

        /** Aplicação */
        app.listen(process.env.PORT, () => {
            process.stdout.write(`Escutando na porta ${process.env.PORT}.\n`);
        })
    } catch (e) {
        process.stdout.write(e.stack + '\n');
    }

    process.on('SIGINT', function() {
        console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
        process.exit(0);
    });
};

start();
