import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Ricreiamo il pool di connessione qui per usarlo nel controller
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Funzione per creare il primo utente Manager
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Controlla se esiste già un manager
        const existingManager = await pool.query("SELECT * FROM users WHERE role = 'manager'");
        if (existingManager.rowCount > 0) {
            return res.status(403).json({ message: 'Un account manager esiste già.' });
        }

        // 2. Cripta la password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 3. Inserisci il nuovo manager nel database
        const newUser = await pool.query(
            "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'manager') RETURNING id, username, role",
            [username, password_hash]
        );

        res.status(201).json({ message: 'Account Manager creato con successo!', user: newUser.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore interno del server." });
    }
};

// Aggiungeremo qui la funzione di login più tardi
export const login = async (req: Request, res: Response) => {
    // ... logica per il login ...
};