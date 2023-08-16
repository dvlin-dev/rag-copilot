import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.message.findUnique({
      where: {
        id,
      },
    });
  }

  getAll(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
    });
  }

  create(createMessageDto: CreateMessageDto) {
    const { conversationId, content, role } = createMessageDto;

    return this.prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    });
  }

  update(updateMessageDto: UpdateMessageDto) {
    const { id, ratingValue } = updateMessageDto;
    return this.prisma.message.update({
      where: {
        id,
      },
      data: {
        ratingValue,
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
