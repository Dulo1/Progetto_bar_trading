// src/routes/auth.routes.ts
import { Router } from 'express';
import { createAdmin, login, checkSetupStatus, getMe } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware'; // Importa il middleware

const router = Router();
// Abbiamo spostato qui la logica di setup status
router.get('/setup/status', checkSetupStatus);
router.post('/setup/create-admin', createAdmin);

// Rotta per il login
router.post('/login', login); // <-- ATTIVA QUESTA ROTTA

// Nuova rotta protetta
router.get('/auth/me', verifyToken, getMe);

export default router;


