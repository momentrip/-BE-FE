import { useEffect, useState } from "react";
import { Text } from "react-native";
import type { StyleProp, TextStyle } from "react-native";

/** 깜빡이는 안내 텍스트. 더블탭/탭 트리거가 있는 화면에서 안내 문구에 쓴다. */
export function S4BlinkingText({ style, text }: { style: StyleProp<TextStyle>; text: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((previous) => !previous), 700);
    return () => clearInterval(id);
  }, []);

  return <Text style={[style, { opacity: visible ? 1 : 0 }]}>{text}</Text>;
}
