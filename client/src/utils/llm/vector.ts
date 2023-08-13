import { OpenAI } from 'langchain/llms/openai';
import {
  LLMChain,
  loadQAMapReduceChain,
  loadQAStuffChain,
} from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain';

const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
console.info('openAIApiKey', openAIApiKey);
export function QAFromDocuments(q: string, documents: Document[]) {
  const model = new OpenAI({
    // temperature: 0.6,
    // maxConcurrency: 10,
    openAIApiKey,
  });
  // const chain = loadQAStuffChain(model);
  // return chain.call({
  //   input_documents: docs,
  //   question: q,
  // });
  const context = documents.reduce((acc, item) => {
    return acc + item[0].pageContent + '\n';
  }, '');
  console.info('context', context);
  const prompt = PromptTemplate.fromTemplate(
    '在结尾处用以下几段语境回答问题。如果你不知道答案，只需说你不知道，不要尝试编造答案。\n\n{context}\n\n问题：{question}\n有用的答案：'
  );
  const chain = new LLMChain({ llm: model, prompt });

  return chain.call({ context, question: q });
}
