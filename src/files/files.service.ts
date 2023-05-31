import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.file.findMany();
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
