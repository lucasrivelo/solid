import { IMailProvider } from "../providers/IMailProvider";

export class NotificationService {
  private mailProvider: IMailProvider;

  constructor(mailProvider: IMailProvider){
    this.mailProvider = mailProvider;
  }

  async OrderConfirmation(customerEmail: string, orderId: string, total: number, items: any[]): Promise<string> {
    const subject = `Confirmação do Pedido #${orderId}`;
    
    const body = `
      <h1>Pedido Confirmado!</h1>
      <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
      <p>Total: <strong>R$ ${total}</strong></p>
      <ul>
        ${items.map(item => `<li>${item.name} (x${item.quantity})</li>`).join('')}
      </ul>
    `;

    return await this.mailProvider.sendMail({
      to: customerEmail,
      subject,
      body
    });
  }
}
