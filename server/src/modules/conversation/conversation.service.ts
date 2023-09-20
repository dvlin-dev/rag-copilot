import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { getKeyConfigurationFromEnvironment } from 'src/utils/llm/configuration';
import { getModel } from 'src/utils/llm/openai';
import { LLMChain } from 'langchain/chains';
import { ChatDto, CompletionsDto } from './dto/chat.dto';
import { PromptTemplate } from 'langchain/prompts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

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
    const { messages, projectId } = chatDto;
    const extractInput = (messages): string =>
      messages[messages.length - 1].content;

    const buildHistory = (messages): string =>
      messages
        .map((message) => {
          switch (message.role) {
            case 'human':
              return `用户：${message.content}`;
            case 'ai':
              return `人工智能：${message.content}`;
            default:
              return '';
          }
        })
        .join('\n');

    const buildBackground = (messages): string =>
      messages
        .filter((message) => message.role === 'system')
        .reduce((acc, cur) => `${acc}\n${cur.content}`, '');

    const buildContext = (background: string, history: string): string =>
      `${background}${history}`;

    const input = extractInput(messages);
    const contexts = messages.slice(0, -1);
    const history = buildHistory(contexts);
    const background = buildBackground(contexts);
    // const context = buildContext(background, history);
    const keyConfiguration = getKeyConfigurationFromEnvironment(
      this.configService
    );
    const model = await getModel(keyConfiguration, 'chatOpenAi');
    // `以下是人类和人工智能之间的友好对话。上下文中提供了许多具体的细节，人工智能的答案的来源都在上下中获取，它不会自己编造答案。如果人工智能无法从上下文中获取问题的答案，它会诚实地说它不知道。
    const baseProjectPrompt = `\n 上下文：{background}。\n 历史消息：{history}。 问题：{input} \n 有用的答案：`;
    const projectPrompt = projectId
      ? (await this.getProjectPrompt(projectId)) || baseProjectPrompt
      : baseProjectPrompt;
    const prompt = PromptTemplate.fromTemplate(projectPrompt);
    const chain = new LLMChain({ llm: model, prompt });
    const { text } = await chain.call({ background, history, input });
    return text;
  }

  async completions(completionsDto: CompletionsDto) {
    const { message } = completionsDto;
    const keyConfiguration = getKeyConfigurationFromEnvironment(
      this.configService
    );
    const model = await getModel(keyConfiguration, 'openAi');

    const prompt = PromptTemplate.fromTemplate(message);

    const chain = new LLMChain({ llm: model, prompt });
    const { text } = await chain.call({});
    return text;
  }

  async getProjectPrompt(projectId: string) {
    const prompt = (
      await this.prisma.project.findUnique({
        where: { id: projectId },
        include: { projectDetail: true },
      })
    ).projectDetail.prompt;
    return `${prompt}`;
  }

  async search(namespace: string) {
    return this.prisma.conversation.findMany({
      where: {
        namespace,
      },
    });
  }
}
