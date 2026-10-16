import type { ImageSourcePropType } from "react-native";

export type S3TeaDisplayData = {
  description: string;
  key: "chrysanthemum" | "omija";
  name: string;
  tags: readonly [string, string];
  teaContentImage: ImageSourcePropType;
  teaContentLayout: Record<1 | 2 | 3, S3TeaContentLayout>;
};

type S3TeaContentLayout = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export const S3_TEA_OPTIONS: readonly S3TeaDisplayData[] = [
  {
    key: "chrysanthemum",
    name: "국화차",
    description: "은은한 향이 긴장을 풀어줘요",
    tags: ["무카페인", "가을 제철"],
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-chrysanthemum.png"),
    teaContentLayout: {
      1: { left: 130.24, top: 210.51, width: 136, height: 203.9 },
      2: { left: 156, top: 248, width: 108, height: 161.9 },
      3: { left: 162, top: 401, width: 84, height: 125.9 },
    },
  },
  {
    key: "omija",
    name: "오미자차",
    description: "오미자의 붉은 달달함이 확신을 줘요",
    tags: ["무카페인", "사계절"],
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-omija.png"),
    teaContentLayout: {
      1: { left: 123, top: 211, width: 128, height: 128 },
      2: { left: 150.2, top: 248.6, width: 101.5, height: 101.5 },
      3: { left: 158.3, top: 401.4, width: 78.4, height: 78.4 },
    },
  },
] as const;
