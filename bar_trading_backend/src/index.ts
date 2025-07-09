// in cima al file src/index.ts
import express from 'express';
import authRoutes from './routes/auth.routes'; // <-- IMPORTA LE ROTTE

// ... altro codice (pool, etc.)...

const app = express();

// Middleware per leggere il JSON dal corpo delle richieste
app.use(express.json()); 
app.use(cors());

// ... codice per la connessione al db ...

// USA LE ROTTE: tutte le rotte in auth.routes.ts saranno precedute da /api
app.use('/api', authRoutes); // <-- USA LE ROTTE

app.listen(port, () => {
    console.log(`🚀 Server in ascolto sulla porta ${port}`);
});