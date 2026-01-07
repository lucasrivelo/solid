import { Product } from './IProduct';

export class DigitalProduct implements Product{
  constructor(
    public id: string,
    public name: string,
    public price: number
  ){}

  calculaFrete(): number{
    return 0;
  }
}