import { createElement } from 'react';

export default function DeployStatus() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>Status: </div>
      {createElement('statuspage-widget', {
        src: 'https://devlink.statuspage.io/',
      })}
    </div>
  );
}
