export interface IPaymentMethod{
  process(Valor: number): Promise<boolean>;
}