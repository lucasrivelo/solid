export interface IOrderRepository {
  save(order: any): Promise<any>;
  find(id: string): Promise<any | null>;
}