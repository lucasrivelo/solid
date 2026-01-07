import { IMailProvider, ISendMailDTO } from './IMailProvider';
import { getMailClient } from '../lib/mail';
import nodemailer from 'nodemailer';
import logger from '../lib/logger';

export class EtherealMailProvider implements IMailProvider {
  async sendMail({ to, subject, body }: ISendMailDTO): Promise<string> {
    const mailer = await getMailClient();

    const info = await mailer.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to,
      subject,
      html: body,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    if (previewUrl){
      logger.info(`Email enviado: ${previewUrl}`);
      return previewUrl;
    }

    return 'E-mail enviado (sem URL de preview)';
  }
}