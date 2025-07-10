// src/routes/event.routes.ts
import { Router } from 'express';
import { createEvent } from '../controllers/event.controller';
import { verifyToken, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Rotta per creare un nuovo evento (solo per i manager)
router.post('/', verifyToken, checkRole(['manager']), createEvent);

export default router;