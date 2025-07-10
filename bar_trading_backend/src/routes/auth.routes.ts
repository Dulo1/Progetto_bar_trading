// src/routes/auth.routes.ts
import { Router } from 'express';
// Assicurati di importare tutte le funzioni che usi
import { createAdmin, login, checkSetupStatus } from '../controllers/auth.controller';

const router = Router();

// Abbiamo spostato qui la logica di setup status
router.get('/setup/status', checkSetupStatus);
router.post('/setup/create-admin', createAdmin);

// Rotta per il login
router.post('/login', login); // <-- ATTIVA QUESTA ROTTA

export default router;