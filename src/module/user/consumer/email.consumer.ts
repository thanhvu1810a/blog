import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('register')
  async registerEmail(job: Job<unknown>) {
    await this.mailerService.sendMail({
      to: job.data['to'],
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: job.data['name'],
        activationCode: job.data['activationCode']
      },
    });
    console.log('Send Success: ');
  }
}