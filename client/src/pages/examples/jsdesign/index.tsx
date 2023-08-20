import { searchVector } from '@/api/vector';
import { Button, Input } from '@douyinfe/semi-ui';
import { useState } from 'react';
import styles from './index.module.scss';
import { useRouter } from 'next/router';

export default function Jsdesign() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const { query } = useRouter();

  const search = () => {
    setLoading(true);
    searchVector({
      message,
      docId: query.docId as string,
      size: 5,
    })
      .then((res) => {
        const { result, docs } = res.data.data;
        setResult(result);
        const _docs = docs.map((item) => item[0].metadata.content);
        console.log(_docs);
        setDocs(_docs);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.exampleContainer}>
      <div>
        仅能回答该页面相关问题:
        <a href='https://js.design/developer-doc/widget/guide/start/Intro'>
          widget guide start Intro
        </a>
      </div>
      <div className={styles.search}>
        <Input value={message} onChange={setMessage}></Input>
        <Button onClick={search} loading={loading}>
          发送
        </Button>
      </div>
      <div>结果：{result}</div>
      <div>
        引用数据：
        {docs.map((item, index) => (
          <p>
            {index}:{item}
          </p>
        ))}
      </div>
    </div>
  );
}
