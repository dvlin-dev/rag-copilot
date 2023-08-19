import { fetcher } from '@/utils/http';
import { Card, CardGroup, Typography } from '@douyinfe/semi-ui';
import useSWR from 'swr';

const List = () => {
  const { Text } = Typography;

  const { data, isLoading } = useSWR('/docs/list', fetcher);
  if (isLoading) return <div>loading...</div>;
  return (
    <div>
      <CardGroup spacing={18}>
        {data.data.map((item) => (
          <Card
            key={item.id}
            title={item.name}
            style={{ maxWidth: 360, minWidth: 260 }}
            headerLine={false}
            headerExtraContent={<Text link>进入</Text>}
          >
            {item.description}
          </Card>
        ))}
      </CardGroup>
    </div>
  );
};

export default List;
