import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';

const prisma = new PrismaClient();

export class PrismaOrderRepository implements IOrderRepository {
  async save(orderData: any): Promise<any> {
    return await prisma.order.create({
      data: {
        customer: orderData.customer,
        total: orderData.total,
        status: orderData.status || 'confirmed',
        items: JSON.stringify(orderData.items) 
      }
    });
  }

  async find(id: string): Promise<any | null> {
    return await prisma.order.findUnique({
      where: { id: Number(id) } 
    });
  }
}