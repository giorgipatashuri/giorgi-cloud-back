import {
  Controller,
  Post,
  Get,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileType, FilesService } from './files.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from './storage';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @User('id') id: number,
  ) {
    return this.filesService.create(file, id);
  }
  @Get()
  async findAll(@User('id') id: number, @Query('type') fileType: FileType) {
    return this.filesService.findAll(id, fileType);
  }
}
