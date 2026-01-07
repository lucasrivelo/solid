export interface IProductRepository{
  findId(id: number): Promise<any | null>;
}