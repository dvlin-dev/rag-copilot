import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function workspace() {
  const { push } = useRouter();

  useEffect(() => {
    push('/workspace/project');
  });
  return <>workplace</>;
}
