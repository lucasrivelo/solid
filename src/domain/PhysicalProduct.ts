import { Product } from './IProduct';

export class PhysicalProduct implements Product{
  public id: string;
  public name: string;
  public price: number;
  public weight: number;
  public dimensions: string;

  constructor(
    id: string,
    name: string,
    price: number,
    weight: number,
    dimensions: string
  ){
    this.id = id;
    this.name = name;
    this.price = price;
    this.weight = weight;
    this.dimensions = dimensions;
  }

  calculaFrete(): number{
    return 10;
  }
}