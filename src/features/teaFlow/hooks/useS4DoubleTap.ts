import { useCallback, useRef } from "react";

import { S4_STEEPING_SETTINGS } from "../constants/s4Steeping";

/**
 * 더블탭을 감지해 콜백을 호출한다. S4 intro 화면들의 "화면을 두번 두드려요" 트리거에 쓴다.
 * @param onDoubleTap 더블탭 간격(S4_STEEPING_SETTINGS.doubleTapWindowMs) 안에 두 번 탭하면 호출
 */
export function useS4DoubleTap(onDoubleTap: () => void): () => void {
  const lastTapRef = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current <= S4_STEEPING_SETTINGS.doubleTapWindowMs) {
      lastTapRef.current = 0;
      onDoubleTap();
    } else {
      lastTapRef.current = now;
    }
  }, [onDoubleTap]);
}
