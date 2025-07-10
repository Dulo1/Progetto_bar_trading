// src/index.ts
import express from 'express';
import cors from 'cors'; // <-- RIGA MANCANTE: Importa cors
import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import drinkRoutes from './routes/drink.routes';

const app = express();
const port = process.env.PORT || 3000; // <-- RIGA MANCANTE: Definisce la porta

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/drinks', drinkRoutes); 

app.listen(port, () => {
    console.log(`🚀 Server in ascolto sulla porta ${port}`);
});