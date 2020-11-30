import { useState } from 'react';

const useForceUpdate = () => {
  const [state, setState] = useState(false);
  return () => setState(!state);
};

export default useForceUpdate;
