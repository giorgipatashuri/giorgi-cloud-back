import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
export enum FileType {
  PHOTOS = 'photos',
  TRASH = 'trash',
}
@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, fileType: FileType) {
    let where: Prisma.FileWhereInput = { userId };

    if (fileType === FileType.PHOTOS) {
      where = { ...where, mimetype: { contains: 'image' } };
    }

    return await this.prisma.file.findMany({
      where,
    });
  }
  async create(file: Express.Multer.File, userId: number) {
    return this.prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        userId: userId,
      },
    });
  }
}
