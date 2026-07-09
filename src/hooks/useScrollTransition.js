import { useEffect } from 'react';

// Fades the dimmer + vaporwave layers in as the user scrolls down the page.
export default function useScrollTransition(dimmerRef, gridRef) {
  useEffect(() => {
    const handleScroll = () => {
      const ratio = Math.min(Math.max(window.scrollY / 600, 0), 1);
      if (dimmerRef.current) dimmerRef.current.style.opacity = ratio * 0.85;
      if (gridRef.current) gridRef.current.style.opacity = ratio;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dimmerRef, gridRef]);
}
