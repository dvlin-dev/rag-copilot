import { fetcher } from '@/utils/http';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import { Button, Card, CardGroup, Empty, Typography } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Docs = () => {
  const { Text } = Typography;
  const { push } = useRouter();

  const { data, isLoading } = useSWR('/doc/list', fetcher);
  if (isLoading) return <div>loading...</div>;
  const isEmpty = data.data.length === 0;
  const empty = () => (
    <Empty
      image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
      darkModeImage={
        <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
      }
      title='无数据'
      description='请先创建知识库，暂时只能通过 /api/doc 路由手动创建'
    />
  );
  return (
    <div>
      {isEmpty ? (
        empty()
      ) : (
        <CardGroup spacing={18}>
          {data.data.map((item) => (
            <Card
              key={item.id}
              title={item.name}
              style={{ maxWidth: 360, minWidth: 260 }}
              headerLine={false}
              headerExtraContent={
                <Text
                  link
                  onClick={() => push(`/workspace/doc/data?id=${item.id}`)}
                >
                  进入
                </Text>
              }
            >
              {item.description}
            </Card>
          ))}
        </CardGroup>
      )}
    </div>
  );
};

export default Docs;
