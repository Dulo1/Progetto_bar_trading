// src/routes/drink.routes.ts
import { Router } from 'express';
import { getAllDrinks, createDrink } from '../controllers/drink.controller';
import { verifyToken, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Applichiamo il middleware a tutte le rotte di questo file
// Prima verifica il token, poi controlla che il ruolo sia 'manager'
router.use(verifyToken, checkRole(['manager']));

// Definiamo le rotte
router.get('/', getAllDrinks);
router.post('/', createDrink);

export default router;