import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { PostsService } from 'src/post/post.service';
import { Job } from 'bullmq';
import { Process } from '@nestjs/bull';

@Processor('import')
export class ImportProcessor extends WorkerHost {
  constructor(private readonly postService: PostsService) {
    super();
  }

  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    console.log('import active: ' + job.id);
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job) {
    console.log('import completed: ' + job.id);
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    console.log(`import failed: ${job.id}. With: ${job.data}. Error: ${err}`);
  }

  @OnWorkerEvent('error')
  onQueueError(e: any) {
    console.log(`Job has got error: ${e}`);
  }

  @OnWorkerEvent('stalled')
  onQueueStalled(job: Job) {
    console.log(`Job has been stalled: ${job.id}`);
  }

  @Process('import-blog')
  async process(job: Job<any, any, string>): Promise<void> {
    await this.postService.verifyImport(job.data);
  }
}