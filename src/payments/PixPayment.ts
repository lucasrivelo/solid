import { IPaymentMethod } from "./IPaymentMethod";
import logger from "../lib/logger";

export class PixPayment implements IPaymentMethod {
  async process(Valor: number): Promise<boolean>{
    logger.info(`Tipo: Pix ~ R$ ${Valor}`);
    return true;
  }
}