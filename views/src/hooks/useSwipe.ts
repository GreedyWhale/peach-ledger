import React from 'react';

interface UseSwipeParams {
  elementRef: React.RefObject<HTMLElement | null> | React.RefObject<(HTMLElement | null)[]>,
  onSwipeLeft?: (_index?: number) => void;
  onSwipeRight?: (_index?: number) => void;
  onSwipeTop?: (_index?: number) => void;
  onSwipeBottom?: (_index?: number) => void;
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

  const handleTouchEnd = React.useCallback((event: TouchEvent, index?: number) => {
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
        params.onSwipeRight?.(index);
        return;
      }

      params.onSwipeLeft?.(index);
    }

    // 垂直方向
    if (Math.abs(offsetY) < threshold.current) {
      return;
    }

    // 下滑
    if (offsetY > 0) {
      params.onSwipeBottom?.(index);
      return;
    }

    params.onSwipeTop?.(index);
  }, [params]);

  const bindLinteners = React.useCallback(() => {
    const _elementRef = params.elementRef.current;
    if (Array.isArray(_elementRef)) {
      const handleTouchEndList = _elementRef.map((element, index) => (event: TouchEvent) => handleTouchEnd(event, index));
      _elementRef.forEach((element, index) => {
        element?.addEventListener('touchstart', handleTouchStart);
        element?.addEventListener('touchend', handleTouchEndList[index]);
        element?.addEventListener('touchmove', handleTouchMove);
      });

      return () => {
        _elementRef.forEach((element, index) => {
          element?.removeEventListener('touchstart', handleTouchStart);
          element?.removeEventListener('touchend', handleTouchEndList[index]);
          element?.removeEventListener('touchmove', handleTouchMove);
        });
      };
    }

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
  }, [handleTouchEnd, handleTouchMove, handleTouchStart, params.elementRef]);

  React.useEffect(() => {
    const unSubscribe = bindLinteners();
    return unSubscribe;
  }, [bindLinteners]);
}
