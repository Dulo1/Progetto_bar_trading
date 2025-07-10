// src/controllers/drink.controller.ts
import { Request, Response } from 'express';
import db from '../database';

export const getAllDrinks = async (_req: Request, res: Response) => {
  try {
    const drinks = await db('drinks_library').where({ is_archived: false }).orderBy('name');
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare i drink." });
  }
};

export const createDrink = async (req: Request, res: Response) => {
  try {
    const { name, description, default_price } = req.body;
    if (!name || !default_price) {
      return res.status(400).json({ message: "Nome e prezzo sono obbligatori." });
    }

    const [newDrink] = await db('drinks_library').insert({ name, description, default_price }).returning('*');
    res.status(201).json(newDrink);
  } catch (error) {
    res.status(500).json({ message: "Errore nella creazione del drink." });
  }
};