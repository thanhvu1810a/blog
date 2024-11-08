import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('register')
  async registerEmail(job: Job<unknown>) {
    const time1 = new Date();
    await this.mailerService.sendMail({
      to: job.data['to'],
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: job.data['name'],
        activationCode: job.data['activationCode']
      },
    });
    const time2 = new Date();
    console.log('Send Success: ',time2.getTime() - time1.getTime(), 'ms');
  }
}