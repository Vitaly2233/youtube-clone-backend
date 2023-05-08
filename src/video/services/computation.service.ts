import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import config from '../../common/config';
import { getFilePathByName } from '../../common/helpers/get-file-path-by-name';
import { EFileType } from '../enum/file-type.enum';

@Injectable()
export class ComputationService {
  computeFilePath(fileType: EFileType, fileId: number, mimetype: string) {
    const folderPath = this.computeFileFolderPath(fileType);
    const fileName = this.computeFileName(fileId, mimetype);
    return `${folderPath}/${fileName}`;
  }

  async computeFilePathByFileName(id: number, fileType: EFileType) {
    const fileName = await getFilePathByName(
      id.toString(),
      this.computeFileFolderPath(fileType),
    );
    return `${this.computeFileFolderPath(fileType)}/${fileName}`;
  }

  computeFileFolderPath(fileType: EFileType) {
    if (fileType === EFileType.preview) return './uploads/previews';
    else return './uploads/videos';
  }

  computeFileName(fileId: number, mimetype: string) {
    const fileExtension = mime.extension(mimetype);
    return `${fileId}.${fileExtension}`;
  }

  computeFileUrl(type: EFileType, fileName: string) {
    if (type === EFileType.preview) {
      return `${config.SERVER_URL}/video-stream/preview/${fileName}`;
    } else {
      return `${config.SERVER_URL}/video-stream/${fileName}`;
    }
  }
}
