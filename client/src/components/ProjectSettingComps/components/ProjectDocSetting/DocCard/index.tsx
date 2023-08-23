import { IconInfoCircle } from '@douyinfe/semi-icons';
import { Card, Popover } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';

interface DocCardProps {
  doc: any;
}

export const DocCard = ({ doc }) => {
  return (
    <Card
      shadows='hover'
      style={{ maxWidth: 360 }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Meta title={doc.name} />
      <Popover
        position='top'
        showArrow
        content={<article style={{ padding: 6 }}>{doc.description}</article>}
      >
        <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
      </Popover>
    </Card>
  );
};
