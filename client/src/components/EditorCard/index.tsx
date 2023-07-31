import { Card, Button, Input } from '@douyinfe/semi-ui';

import styles from './index.module.scss';
import { useEffect, useState } from 'react';

interface BaseSettingCardProps {
  title: string;
  tips?: string;
  description?: string;
}

interface InputSettingCardProps extends BaseSettingCardProps {
  type: 'input';
  placeholder: string;
  value: string;
  initialValue: string;
  onInputChange: (
    value: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSave: () => void;
  loading?: boolean;
  isExternallyDisabled?: boolean;
}

interface CumstomSettingCardProps extends BaseSettingCardProps {
  type: 'customDefinition';
  children: React.ReactNode;
}

type SettingCardProps = InputSettingCardProps | CumstomSettingCardProps;

const EditorCard = (props: SettingCardProps) => {
  const { title, type, tips, description } = props;

  const [isDisabled, setIsDisabled] = useState(true);

  const handleInputChange = (
    value: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (type === 'input') {
      setIsDisabled(value === (props as InputSettingCardProps).initialValue);
      props.onInputChange && props.onInputChange(value, e);
    }
  };

  const finalDisabled =
    isDisabled || (props as InputSettingCardProps).isExternallyDisabled;

  return (
    <Card
      className={styles.SettingCard}
      cover={
        <div className={styles.cardCover}>
          {title}
          {type === 'input' ? (
            <Input
              value={
                (props as InputSettingCardProps).value ||
                (props as InputSettingCardProps).initialValue
              }
              onChange={handleInputChange}
              placeholder={(props as InputSettingCardProps).placeholder}
            />
          ) : (
            props.children
          )}
        </div>
      }
      footerLine={true}
      footerStyle={{
        backgroundColor: 'rgb(250, 250, 250)',
        minHeight: 57,
        fontSize: '0.875rem',
        lineHeight: 1.6,
        padding: '12px 24px',
      }}
      footer={
        <div className={styles.footerStyle}>
          {tips}
          {type === 'input' && (
            <Button
              theme='solid'
              type='primary'
              onClick={(props as InputSettingCardProps).onSave}
              disabled={finalDisabled}
              loading={(props as InputSettingCardProps).loading}
            >
              保存
            </Button>
          )}
        </div>
      }
      bodyStyle={{ display: 'none' }}
    />
  );
};

export default EditorCard;
