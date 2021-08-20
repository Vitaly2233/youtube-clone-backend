import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PreviewService {
  constructor(private httpService: HttpService) {}

  upload(userId: number, photoId: string | number, buffer: Buffer) {
    writeFileSync(this.getPreviewPath(userId, photoId), buffer);
  }

  async getPreview(userId: number, photoId: string, res) {
    console.log(this.getPreviewPath(userId, photoId));

    res.sendFile(this.getPreviewPath(userId, photoId));
  }

  private getPreviewPath(userId: string | number, photoId: string | number) {
    return join(
      __dirname,
      '../../upload',
      userId.toString(),
      (photoId as string) + '.png',
    );
  }
}
