import { useState } from 'react';

const uniqueId = ((): ((prefix: string) => string) => {
  let counter = 0;
  return (prefix: string): string => `${prefix}${++counter}`;
})();

function useUniqueId(customPrefix?: string) {
  const [id, setId] = useState(
    customPrefix ? uniqueId(customPrefix + '-') : uniqueId('component-'),
  );
  return id;
}
export default useUniqueId;
