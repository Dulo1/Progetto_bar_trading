// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database'; // <-- Importiamo la nostra connessione Knex

// Funzione per creare il primo utente Manager
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Controlla se esiste già un manager usando Knex
        const existingManager = await db('users').where({ role: 'manager' }).first();
        if (existingManager) {
            return res.status(403).json({ message: 'Un account manager esiste già.' });
        }

        // 2. Cripta la password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Inserisci il nuovo manager nel database usando Knex
        const [newUser] = await db('users')
            .insert({
                username,
                password_hash,
                role: 'manager',
            })
            .returning(['id', 'username', 'role']);

        res.status(201).json({ message: 'Account Manager creato con successo!', user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore interno del server." });
    }
};

// Aggiungeremo qui la funzione di login più tardi
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Cerca l'utente nel database
        const user = await db('users').where({ username }).first();
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Confronta la password fornita con quella salvata (hash)
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Se le credenziali sono corrette, crea il token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'una-chiave-segreta-di-default', // Aggiungi JWT_SECRET al tuo .env!
            { expiresIn: '8h' } // Il token scadrà dopo 8 ore
        );

        // Invia il token al client
        res.status(200).json({ token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
};

// 3. AGGIUNGI LA FUNZIONE PER CONTROLLARE LO STATO
export const checkSetupStatus = async (_req: Request, res: Response) => {
    try {
        const manager = await db('users').where({ role: 'manager' }).first();
        res.status(200).json({ setupNeeded: !manager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel controllare lo stato del setup.' });
    }
};
