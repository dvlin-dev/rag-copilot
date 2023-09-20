import {
  Button,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Skeleton,
  Slider,
} from '@douyinfe/semi-ui';
import { useState } from 'react';

import styles from './index.module.scss';
import { similaritySearch } from '@/api/vector';
import { useRouter } from 'next/router';

const WorkShop = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<similaritySearchResponseItem[]>([]);
  const { query } = useRouter();
  const placeholder = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: 12,
        borderBottom: '1px solid var(--semi-color-border)',
      }}
    >
      <div>
        <Skeleton.Title
          style={{ width: 120, marginBottom: 12, marginTop: 12 }}
        />
        <Skeleton.Paragraph style={{ width: 600 }} rows={2} />
      </div>
    </div>
  );
  const dataList = () => (
    <List
      loading={loading}
      dataSource={list}
      renderItem={(item) => (
        <Skeleton placeholder={placeholder} loading={loading}>
          <List.Item
            main={
              <div>
                <p
                  style={{ color: 'var(--semi-color-text-1)', margin: '4px 0' }}
                >
                  {item.pageContent}
                </p>
                {/* <Slider defaultValue={item.metadata._distance} disabled /> */}
                <div
                  style={{
                    color: 'var(--semi-color-text-3)',
                    margin: '4px 0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  相似度：
                  <Progress
                    percent={item.metadata._distance * 100}
                    showInfo={true}
                    aria-label='disk usage'
                  />
                </div>
              </div>
            }
          />
        </Skeleton>
      )}
    />
  );

  const search = () => {
    setLoading(true);
    const id = query.id as string;
    const params = {
      message: searchValue,
      docIds: [id],
      size: 3,
    };
    similaritySearch(params)
      .then((res) => {
        setList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.workShop}>
      <div className={styles.searchContainer}>
        <Input
          placeholder='请输入...'
          className={styles.searchInput}
          value={searchValue}
          onChange={setSearchValue}
        />
        <Button block onClick={search} className={styles.searchBtn}>
          测试
        </Button>
      </div>
      {dataList()}
    </div>
  );
};

export default WorkShop;
