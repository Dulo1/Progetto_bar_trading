// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';
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
export const login = async (_req: Request, _res: Response) => {
    // ... logica per il login ...
};