export type S3TeaBagStage = 1 | 2 | 3;

type S3TeaBagLayout = {
  height: number;
  left: number;
  rotationDegrees: number;
  top: number;
  width: number;
};

/**
 * Figma 티백 instance의 원본 비율과 회전을 React Native의 중심 회전 기준으로 환산한 배치값이다.
 */
export const S3_TEA_BAG_LAYOUT: Record<S3TeaBagStage, S3TeaBagLayout> = {
  1: {
    left: 111.918,
    top: 141.685,
    width: 141.591,
    height: 231.343,
    rotationDegrees: -27.917,
  },
  2: {
    left: 141.42,
    top: 193.613,
    width: 112.302,
    height: 183.488,
    rotationDegrees: -27.917,
  },
  3: {
    left: 151.538,
    top: 358.962,
    width: 86.686,
    height: 141.634,
    rotationDegrees: -27.917,
  },
};
