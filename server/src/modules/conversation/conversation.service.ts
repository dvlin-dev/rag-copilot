import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });
  }

  getAll(projectId: string) {
    return this.prisma.conversation.findMany({
      where: {
        projectId,
      },
    });
  }

  create(createConversationDto: CreateConversationDto) {
    const { projectId } = createConversationDto;

    return this.prisma.conversation.create({
      data: {
        projectId,
      },
    });
  }

  delete(id: string) {
    return this.prisma.conversation.delete({
      where: {
        id,
      },
    });
  }
}
