export interface ISendMailDTO{
  to: string;
  subject: string;
  body: string;
}

export interface IMailProvider{
  sendMail(mail: ISendMailDTO): Promise<string>;
}