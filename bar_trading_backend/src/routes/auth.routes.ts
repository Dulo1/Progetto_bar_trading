import { Router } from 'express';
import { createAdmin, } from '../controllers/auth.controller';

const router = Router();

// Rotta per la configurazione del primo admin
router.post('/setup/create-admin', createAdmin);

// Rotta per il login
// router.post('/login', login); // La attiveremo dopo

export default router;