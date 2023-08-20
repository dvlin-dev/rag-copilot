import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';

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

  async chat(conversationId: string, createChatDto: CreateChatDto) {
    const { content, projectId } = createChatDto;
    // 根据 conversationId 查到对应的 project，然后根据 project 的 docId 查到对应的 docs, 然后调用 similaritySearch
    // const { docs } = await this.prisma.project.findUnique({
    //   where: {
    //     id: projectId,
    //   },
    //   include: {
    //     docs: true,
    //   },
    // });
    // console.log(docs);
  }
}
