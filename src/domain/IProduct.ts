export interface Product{
  id: string;
  name: string;
  price: number;
  calculaFrete(): number;
}