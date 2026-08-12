import { useEffect, useLayoutEffect } from 'react';

/**
 * Isomorphic layout effect hook that safely resolves to useLayoutEffect on client side
 * and useEffect during server-side rendering or non-DOM environments.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect;

export default useIsomorphicLayoutEffect;
