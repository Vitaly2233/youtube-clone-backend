import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export class PreviewService {
  upload(userId: number, name: string | number, buffer: Buffer) {
    writeFileSync(this.getPreviewPath(userId, name), buffer);
  }

  private getPreviewPath(userId: number, name: string | number) {
    return `./upload/${userId}/${name}.png`;
  }
}
