import { IPaymentMethod } from "./IPaymentMethod";
import logger from "../lib/logger";

export class CreditCardPayment implements IPaymentMethod{
  private details:{numero: string; cvv: string; validade: string};

  constructor(details:{numero: string; cvv: string; validade: string}){
    this.details = details;
  }

  async process(Valor: number): Promise<boolean>{
    logger.info(`Tipo: Cartão de Crédito ~ R$ ${Valor}`);
    
    //se o CVV for 000, é inválido
    if (this.details.cvv === "000"){
      return false;
    }

    return true;
  }
}
