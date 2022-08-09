import React from 'react';

interface UseSwipeParams {
  elementRef: React.RefObject<HTMLElement>,
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeTop?: () => void;
  onSwipeBottom?: () => void;
}

export default function useSwipe(params: UseSwipeParams) {
  const startPoint = React.useRef({ x: 0, y: 0 });
  const threshold = React.useRef(50);

  const handleTouchStart = React.useCallback((event: TouchEvent) => {
    startPoint.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }, []);

  const handleTouchMove = React.useCallback((event: TouchEvent) => {
    event.preventDefault();
  }, []);

  const handleTouchEnd = React.useCallback((event: TouchEvent) => {
    const { clientX, clientY } = event.changedTouches[0];
    const offsetX = clientX - startPoint.current.x;
    const offsetY = clientY - startPoint.current.y;
    startPoint.current = { x: 0, y: 0 };

    if (Math.abs(offsetX) > Math.abs(offsetY)) { // 水平方向
      if (Math.abs(offsetX) < threshold.current) {
        return;
      }

      // 右滑
      if (offsetX > 0) {
        params.onSwipeRight?.();
        return;
      }

      params.onSwipeLeft?.();
    }

    // 垂直方向
    if (Math.abs(offsetY) < threshold.current) {
      return;
    }

    // 下滑
    if (offsetY > 0) {
      params.onSwipeBottom?.();
      return;
    }

    params.onSwipeTop?.();
  }, [params]);

  React.useEffect(() => {
    const _elementRef = params.elementRef.current;
    if (_elementRef) {
      _elementRef.addEventListener('touchstart', handleTouchStart);
      _elementRef.addEventListener('touchend', handleTouchEnd);
      _elementRef.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (_elementRef) {
        _elementRef.removeEventListener('touchstart', handleTouchStart);
        _elementRef.removeEventListener('touchend', handleTouchEnd);
        _elementRef.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [params.elementRef, handleTouchEnd, handleTouchStart, handleTouchMove]);
}
