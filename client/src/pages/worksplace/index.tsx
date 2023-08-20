import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Worksplace() {
  const { push } = useRouter();

  useEffect(() => {
    push('/workspace/project');
  });
  return <>workplace</>;
}
