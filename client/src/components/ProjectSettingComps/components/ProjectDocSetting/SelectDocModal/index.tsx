import useSWR from 'swr';
import { fetcher } from '@/utils/http';
import { Checkbox, CheckboxGroup, Modal } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';

interface SelectDocModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (checkedList: string[]) => void;
  confirmLoading: boolean;
  docs: any;
}

const SelectDocModal: React.FC<SelectDocModalProps> = ({
  visible,
  onCancel,
  onOk,
  docs,
  confirmLoading,
}) => {
  const [checkedList, setCheckedList] = useState([]);
  const { data, isLoading } = useSWR('/doc/list', fetcher);
  if (isLoading) return <div>loading...</div>;
  const docIds = docs.map((item) => item.id);
  const checkedIds = checkedList.length > 0 ? checkedList : docIds;
  return (
    <Modal
      title={'选择知识库'}
      visible={visible}
      onOk={() => onOk(checkedIds)}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      width={400}
      zIndex={99999}
    >
      <CheckboxGroup
        type='card'
        direction='vertical'
        value={checkedIds}
        onChange={(value) => setCheckedList(value)}
      >
        {data.map((item) => (
          <Checkbox value={item.id} extra={item.description} key={item.id}>
            {item.name}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Modal>
  );
};

export default SelectDocModal;
