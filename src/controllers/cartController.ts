import { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { toBoolean } from '../utils/formatter.js';

export const getRecords = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const data = await prisma.cart.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            createdAt: true
          }
        }
      }
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const data = await prisma.cart.create({
      data: {
        userId: Number(userId),
        productId: Number(productId),
        quantity: Number(quantity)
      },
    });
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create cart' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const dataToUpdate: any = {
      quantity: Number(quantity)
    };

    const data = await prisma.cart.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.cart.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete cart' });
  }
};
