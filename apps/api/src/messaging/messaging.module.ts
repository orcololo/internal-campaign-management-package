import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller';
import { TemplatesService } from './templates.service';
import { CampaignsService } from './campaigns.service';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [DatabaseModule, NotificationsModule],
    controllers: [MessagingController],
    providers: [TemplatesService, CampaignsService],
    exports: [TemplatesService, CampaignsService],
})
export class MessagingModule { }
