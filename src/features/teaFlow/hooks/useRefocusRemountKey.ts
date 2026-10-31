import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

/**
 * 뒤로가기로 화면에 돌아올 때마다 바뀌는 key를 돌려준다. stack 아래에 남아 있던 화면의 완료 state를
 * 버리고 처음부터 다시 진행하도록 화면 컴포넌트의 key로 넘긴다.
 * 입력: 없음
 * @returns 처음 진입 시 0, 다시 focus될 때마다 1씩 증가하는 값
 * 사용처: src/app/tea-preparation, tea-steeping, tea-pouring
 */
export function useRefocusRemountKey(): number {
  const [remountKey, setRemountKey] = useState(0);
  const focusedBeforeRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (focusedBeforeRef.current) {
        setRemountKey((previous) => previous + 1);
      }
      focusedBeforeRef.current = true;
    }, []),
  );

  return remountKey;
}
