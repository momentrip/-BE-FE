import type { ImageSourcePropType } from "react-native";

import type { TeaItem, TeaName } from "@/features/quote";

import { getTeaId } from "./teaIds";
import type { TeaId } from "./teaIds";

export type S3TeaDisplayData = {
  description: string;
  glowColor: S3TeaGlowColor;
  key: TeaId;
  name: TeaName;
  tags: readonly [string, string];
  teaContentImage?: ImageSourcePropType;
  teaContentLayout: Record<1 | 2 | 3, S3TeaContentLayout>;
};

export type S3TeaGlowColor = {
  edge: string;
  primary: string;
  secondary: string;
};

type S3TeaContentLayout = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type S3TeaVisualData = Pick<
  S3TeaDisplayData,
  "description" | "glowColor" | "teaContentImage" | "teaContentLayout"
>;

const DEFAULT_TEA_CONTENT_LAYOUT: S3TeaDisplayData["teaContentLayout"] = {
  1: { left: 130.24, top: 210.51, width: 136, height: 203.9 },
  2: { left: 156, top: 248, width: 108, height: 161.9 },
  3: { left: 162, top: 401, width: 84, height: 125.9 },
};

const DEFAULT_GLOW_COLOR: S3TeaGlowColor = {
  primary: "#FFE75E",
  secondary: "#ECC218",
  edge: "#745508",
};

const S3_TEA_VISUALS: Partial<Record<TeaName, S3TeaVisualData>> = {
  국화차: {
    description: "은은한 향이 긴장을 풀어줘요",
    glowColor: DEFAULT_GLOW_COLOR,
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-chrysanthemum.png"),
    teaContentLayout: DEFAULT_TEA_CONTENT_LAYOUT,
  },
  오미자차: {
    description: "오미자의 붉은 달달함이 확신을 줘요",
    glowColor: {
      primary: "#EF5D62",
      secondary: "#D9353F",
      edge: "#6F1820",
    },
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-omija.png"),
    teaContentLayout: {
      1: { left: 123, top: 211, width: 128, height: 128 },
      2: { left: 150.2, top: 248.6, width: 101.5, height: 101.5 },
      3: { left: 158.3, top: 401.4, width: 78.4, height: 78.4 },
    },
  },
};

/**
 * quote가 추천한 차 목록을 S3 표시 데이터로 변환한다.
 * quote의 순서와 caffeine/season metadata를 그대로 유지한다.
 */
export function getS3TeaOptions(teas: readonly TeaItem[]): S3TeaDisplayData[] {
  return teas.map((tea) => {
    const visual = S3_TEA_VISUALS[tea.name];

    return {
      key: getTeaId(tea.name),
      name: tea.name,
      description: visual?.description ?? "",
      glowColor: visual?.glowColor ?? DEFAULT_GLOW_COLOR,
      tags: [tea.caffeine ? "카페인" : "무카페인", tea.season],
      teaContentImage: visual?.teaContentImage,
      teaContentLayout: visual?.teaContentLayout ?? DEFAULT_TEA_CONTENT_LAYOUT,
    };
  });
}
