import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { NotificationService } from '../services/NotificationService';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import logger from '../lib/logger';

// Lembram do God Class q falamos em aula? Este é um exemplo
export class OrderController {
  
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const orderRepository = new PrismaOrderRepository();
      const productRepository = new PrismaProductRepository();
      const mailProvider = new EtherealMailProvider();
      const notificationService = new NotificationService(mailProvider);

      let payment: IPaymentMethod;
      
      if (paymentMethod === 'credit_card'){
        payment = new CreditCardPayment(paymentDetails);
      } else if (paymentMethod === 'pix'){
        payment = new PixPayment();
      } else{
        return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }

      const orderService = new OrderService(
        orderRepository,
        productRepository,
        notificationService,
        payment
      );

      const result = await orderService.execute({
        customer,
        items
      });

      return res.status(201).json({
        message: 'Pedido processado com sucesso',
        orderId: result.order.Id,
        emailPreview: result.emailPreviewUrl
      });

    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Erro interno' });
    }
  }
}