import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { getKeyConfigurationFromEnvironment } from 'src/utils/llm/configuration';
import { getModel } from 'src/utils/llm/openai';
import { ConversationChain } from 'langchain/chains';
import { ChatDto } from './dto/chat.dto';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

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
    const { projectId, namespace } = createConversationDto;

    return this.prisma.conversation.create({
      data: {
        projectId,
        namespace,
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

  async chat(chatDto: ChatDto) {
    const { messages } = chatDto;
    let input: string;
    if (messages.length === 1) {
      input = messages[0].content;
    } else {
      input = messages[messages.length - 1].content;
    }

    const historyMessages = messages
      ?.slice(0, messages.length - 1)
      .map((message) => {
        if (message.role === 'human') {
          return HumanMessagePromptTemplate.fromTemplate(message.content);
        } else if (message.role === 'ai') {
          return AIMessagePromptTemplate.fromTemplate(message.content);
        } else if (message.role === 'system') {
          return SystemMessagePromptTemplate.fromTemplate(message.content);
        }
        throw new BadRequestException('Invalid message role');
      });

    const keyConfiguration = getKeyConfigurationFromEnvironment();
    const model = await getModel(keyConfiguration, 'chatOpenAi');
    const prompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        '我是 docs-copilot 小助手，我会从上下文中获取答案，如果从中得不到问题的答案，我会诚实地说不知道。'
      ),
      ...historyMessages,
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chain = new ConversationChain({ llm: model, prompt });
    const { response } = await chain.call({ input });
    return response;
  }

  async search(namespace: string) {
    return this.prisma.conversation.findMany({
      where: {
        namespace,
      },
    });
  }
}
