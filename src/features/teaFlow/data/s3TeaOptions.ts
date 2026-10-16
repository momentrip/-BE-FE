import type { ImageSourcePropType } from "react-native";

export type S3TeaDisplayData = {
  description: string;
  key: "chrysanthemum" | "omija";
  name: string;
  tags: readonly [string, string];
  teaContentImage: ImageSourcePropType;
};

export const S3_TEA_OPTIONS: readonly S3TeaDisplayData[] = [
  {
    key: "chrysanthemum",
    name: "국화차",
    description: "은은한 향이 긴장을 풀어줘요",
    tags: ["무카페인", "가을 제철"],
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-chrysanthemum.png"),
  },
  {
    key: "omija",
    name: "오미자차",
    description: "오미자의 붉은 달달함이 확신을 줘요",
    tags: ["무카페인", "사계절"],
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-omija.png"),
  },
] as const;
