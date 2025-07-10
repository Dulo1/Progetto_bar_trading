// src/index.ts
import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import drinkRoutes from './routes/drink.routes';
import eventRoutes from './routes/event.routes'; 

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/drinks', drinkRoutes); 
app.use('/api/events', eventRoutes); 

app.listen(port, () => {
    console.log(`🚀 Server in ascolto sulla porta ${port}`);
});