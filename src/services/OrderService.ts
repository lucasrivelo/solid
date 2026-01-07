import { IOrderRepository, IProductRepository, PrismaOrderRepository, PrismaProductRepository } from "../repositories/Index";
import { NotificationService } from "./NotificationService";
import { IPaymentMethod } from "../payments/IPaymentMethod";
import { ProductFactory } from "../domain/ProductFactory";
import logger from "../lib/logger";

export class OrderService{
  private orderRepository: IOrderRepository;
  private productRepository: IProductRepository;
  private notificationService: NotificationService;
  private paymentMethod: IPaymentMethod;

  constructor(
    orderRepository: IOrderRepository,
    productRepository: IProductRepository,
    notificationService: NotificationService,
    paymentMethod: IPaymentMethod
  ) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository; 
    this.notificationService = notificationService;
    this.paymentMethod = paymentMethod;
  }

  async execute(orderRequest: any){
    logger.info(`Processamento do pedido para: ${orderRequest.customerEmail}`);

    try {
      const products = await Promise.all(
        orderRequest.items.map(async (item: any) => {
          // Busca o produto no banco pelo ID
          const ProdutoB = await this.productRepository.findId(Number(item.productId));

          if (!ProdutoB) {
            throw new Error(`Produto ${item.productId} não encontrado.`);
          }

          return ProductFactory.createProduct({
            ...ProdutoB,
            quantity: item.quantity
          });
        })
      );

      //2
      let totalAmount = 0;
      products.forEach((product: any, index: number) => {
        const quantidade = orderRequest.items[index].quantity;
        if (quantidade<=0){
          throw new Error(`Quantidade inválida para o produto.`);
        }
        
        const frete = product.calculaFrete(); 
        totalAmount += (product.price * quantidade) + frete;
      });

      //3
      const paymentAccepted = await this.paymentMethod.process(totalAmount);
      if (!paymentAccepted) throw new Error("Pagamento recusado.");

      //4
      const order = await this.orderRepository.save({
        customer: orderRequest.customer,
        total: totalAmount,
        status: 'confirmed',
        items: orderRequest.items
      });

      //5
      const itensEmail = products.map((product, index) => ({
        name: product.name,
        quantity: orderRequest.items[index].quantity
      }));

      const emailPreviewUrl = await this.notificationService.OrderConfirmation(
        orderRequest.customer,
        order.id,
        totalAmount,
        itensEmail
      );

    logger.info(`Pedido #${order.id} processado com sucesso.`);
      return { order, emailPreviewUrl };

    } catch (error: any) {
      logger.error(`Falha no OrderService: ${error.message}`);
      throw error; 
    }
  }
}