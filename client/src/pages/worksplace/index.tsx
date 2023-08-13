import { searchVector } from '@/api/vector';
import { QAFromDocuments } from '@/utils/llm/vector';
import { Button, Input } from '@douyinfe/semi-ui';
import { useState } from 'react';

export default function Worksplace() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');

  const search = () => {
    searchVector({
      message,
      docs_id: '17c120ab-29f3-4d14-b83f-2a647872e306',
      number: 5,
    })
      .then((res) => {
        console.info('res.data.documents', res.data.documents);
        return QAFromDocuments(message, res.data.documents);
      })
      .then((res) => {
        console.info('setResult:', res);
        setResult(res.text);
      });
  };
  return (
    <>
      <Input value={message} onChange={setMessage}></Input>
      <Button onClick={search}>发送</Button>
      <div>结果：{result}</div>
    </>
  );
}
