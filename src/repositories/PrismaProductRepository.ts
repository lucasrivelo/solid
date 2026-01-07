import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';

const prisma = new PrismaClient();

export class PrismaProductRepository implements IProductRepository{
  async findId(id: number): Promise<any | null>{
    return await prisma.product.findUnique({
      where: { id: id }
    });
  }
}