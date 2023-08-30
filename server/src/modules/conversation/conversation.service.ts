import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { getKeyConfigurationFromEnvironment } from 'src/utils/llm/configuration';
import { getModel } from 'src/utils/llm/openai';
import { LLMChain, PromptTemplate } from 'langchain';

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

  async chat(content: string) {
    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const model = await getModel(keyConfiguration);
    const prompt = PromptTemplate.fromTemplate(
      '以下是人类和人工智能之间的友好对话。人工智能是健谈的，从它的上下文中提供了许多具体的细节。如果人工智能不知道问题的答案，它会诚实地说它不知道。\n问题：{content}\n有用的答案：'
    );
    console.info('content1', content);
    const chain = new LLMChain({ llm: model, prompt });
    console.info('content2', content);
    return chain.call({ content });
  }
}
