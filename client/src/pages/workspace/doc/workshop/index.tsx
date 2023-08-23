import { Button, Input, List, Skeleton, Slider } from '@douyinfe/semi-ui';
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
                <span
                  style={{ color: 'var(--semi-color-text-3)', margin: '4px 0' }}
                >
                  相似度：
                  {item.metadata._distance === 0 ? 1 : item.metadata._distance}
                </span>
              </div>
            }
          />
        </Skeleton>
      )}
    />
  );

  const search = () => {
    setLoading(true);
    const params = {
      message: searchValue,
      docId: query.id as string,
      size: 3,
    };
    similaritySearch(params)
      .then((res) => {
        setList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
    console.info('searchValue', searchValue);
  };
  return (
    <div className={styles.workShop}>
      <div className={styles.searchContainer}>
        <Input
          placeholder='请输入...'
          showClear
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
