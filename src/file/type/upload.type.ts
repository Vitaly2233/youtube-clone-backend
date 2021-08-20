enum UploadEnum {
  video,
  preview,
}
export type UploadFilesTypes = {
  [file in keyof typeof UploadEnum]: Array<Express.Multer.File>;
};
