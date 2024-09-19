import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION || './uploads',
};

export const multerOptions: { limits: any; fileFilter: any; storage: any } = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },

  fileFilter: (req: Request, file: any, cb: any) => {
    if (/\.(xlsx|xls|xlsm|xlsb|xlt|csv|ods)$/i.test(file?.originalname))
      cb(null, true);
    else
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`,
        ),
        false,
      );
  },

  storage: diskStorage({
    destination: multerConfig.dest,
    filename: (req: any, file: Express.Multer.File, cb: any) => {
      cb(null, `${uuid()}${file.originalname}`);
    },
  }),
};