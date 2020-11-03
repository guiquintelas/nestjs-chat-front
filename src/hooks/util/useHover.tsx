import { useEffect, useRef, useState } from 'react';

const useHover = () => {
  const [value, setValue] = useState(false);

  const ref = useRef<HTMLElement>(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (!node) {
        return () => {};
      }

      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, value] as const;
};

export default useHover;
