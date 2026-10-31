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

type S3TeaVisualData = Pick<S3TeaDisplayData, "glowColor" | "teaContentLayout"> & {
  description?: string;
  teaContentImage: ImageSourcePropType;
};

// 신규 차 이미지는 resizeMode="contain"으로 그려지므로 비율이 달라도 같은 정사각형 영역을 쓴다.
const SQUARE_TEA_CONTENT_LAYOUT: S3TeaDisplayData["teaContentLayout"] = {
  1: { left: 123, top: 211, width: 128, height: 128 },
  2: { left: 150.2, top: 248.6, width: 101.5, height: 101.5 },
  3: { left: 158.3, top: 401.4, width: 78.4, height: 78.4 },
};

function createTeaGlowColor(color: string): S3TeaGlowColor {
  return { primary: color, secondary: color, edge: color };
}

// createTeaGlowColor 값은 zen TEA_COLOR와 같다. 이 표는 모듈 로드 시점에 만들어지는데
// zen이 teaFlow를 import하고 있어, zen을 여기서 import하면 순환 참조로 값이 비어 있을 수 있다.
const S3_TEA_VISUALS: Record<TeaName, S3TeaVisualData> = {
  국화차: {
    description: "은은한 향이 긴장을 풀어줘요",
    glowColor: {
      primary: "#FFE75E",
      secondary: "#ECC218",
      edge: "#745508",
    },
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-chrysanthemum.png"),
    teaContentLayout: {
      1: { left: 130.24, top: 210.51, width: 136, height: 203.9 },
      2: { left: 156, top: 248, width: 108, height: 161.9 },
      3: { left: 162, top: 401, width: 84, height: 125.9 },
    },
  },
  오미자차: {
    description: "오미자의 붉은 달달함이 확신을 줘요",
    glowColor: {
      primary: "#EF5D62",
      secondary: "#D9353F",
      edge: "#6F1820",
    },
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-omija.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  둥글레차: {
    glowColor: createTeaGlowColor("#E2C27A"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-solomons-seal.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  "우전 녹차": {
    glowColor: createTeaGlowColor("#C4CC90"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-ujeon-green-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  백차: {
    glowColor: createTeaGlowColor("#CFC690"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-white-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  옥수수차: {
    glowColor: createTeaGlowColor("#C8B868"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-corn-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  "세작 녹차": {
    glowColor: createTeaGlowColor("#8EA048"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-sejak-green-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  "중작 녹차": {
    glowColor: createTeaGlowColor("#7E9440"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-jungjak-green-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  감잎차: {
    glowColor: createTeaGlowColor("#A6A04A"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-persimmon-leaf-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  구기자차: {
    glowColor: createTeaGlowColor("#B0482E"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-goji-berry-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  대추차: {
    glowColor: createTeaGlowColor("#6E2C16"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-jujube-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  쌍화차: {
    glowColor: createTeaGlowColor("#5A2614"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-ssanghwa-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  연꽃차: {
    glowColor: createTeaGlowColor("#C8A090"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-lotus-flower-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  매화차: {
    glowColor: createTeaGlowColor("#D8B8A8"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-plum-blossom-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  황차: {
    glowColor: createTeaGlowColor("#A86A28"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-yellow-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  잭살차: {
    glowColor: createTeaGlowColor("#8E5A26"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-jaeksal-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  우엉차: {
    glowColor: createTeaGlowColor("#7A5430"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-burdock-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  쑥차: {
    glowColor: createTeaGlowColor("#5A6430"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-mugwort-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
  },
  뽕잎차: {
    glowColor: createTeaGlowColor("#66703A"),
    teaContentImage: require("../../../../assets/images/teaFlow/s3-tea-content-mulberry-leaf-tea.png"),
    teaContentLayout: SQUARE_TEA_CONTENT_LAYOUT,
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
      description: visual.description ?? "",
      glowColor: visual.glowColor,
      tags: [tea.caffeine ? "카페인" : "무카페인", tea.season],
      teaContentImage: visual.teaContentImage,
      teaContentLayout: visual.teaContentLayout,
    };
  });
}
