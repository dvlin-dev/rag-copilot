import {
  Button,
  Divider,
  Radio,
  RadioGroup,
  Form,
  useFormApi,
} from '@douyinfe/semi-ui';
import styles from './index.module.scss';
import { useState } from 'react';
import { ToastSuccess, ToastWaring } from '@/utils/common';
import { addVector } from '@/api/vector';
import { useRouter } from 'next/router';

type ImportType = 'manual' | 'auto';

const { Input, TextArea } = Form;

const Import = () => {
  const [type, setType] = useState<ImportType>('manual');
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setType(type);
  };

  const handleAdd = (value, formApi) => {
    if (value.content === '') {
      ToastWaring('请输入内容');
    } else {
      setLoading(true);
      const docId = query.id;
      const vector = {
        ...value,
        docId,
      };
      addVector(vector)
        .then(() => {
          ToastSuccess('添加成功');
          formApi.reset();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className={styles.importContainer}>
      <RadioGroup
        type='pureCard'
        defaultValue={type}
        direction='horizontal'
        onChange={handleTypeChange}
      >
        <Radio
          value={'manual'}
          extra='手动输入的数据源提供最高的数据精确度'
          style={{ height: 80 }}
        >
          手动输入
        </Radio>
        <Radio
          value={'auto'}
          extra='选择文本文件，自动按段落进行处理'
          style={{ height: 80 }}
        >
          自动拆分
        </Radio>
      </RadioGroup>
      <Divider style={{ margin: '20px 0' }} />
      <div className={styles.importContent}>
        {type === 'manual' ? (
          <>
            <Form layout='horizontal'>
              {({ formState, values, formApi }) => (
                <div className={styles.manualContainer}>
                  <TextArea
                    field='content'
                    label='内容'
                    required
                    rules={[{ required: true, message: '请输入内容' }]}
                  />
                  {/* <Input field='source' label='来源' /> */}
                  <Button
                    className={styles.importBtn}
                    loading={loading}
                    onClick={() => handleAdd(values, formApi)}
                  >
                    添加
                  </Button>
                </div>
              )}
            </Form>
          </>
        ) : (
          <div>自动拆分 doing~</div>
        )}
      </div>
    </div>
  );
};

export default Import;
