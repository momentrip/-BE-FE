/**
 * 폰트 패밀리 토큰.
 * 실제 로드는 src/app/_layout.tsx의 useFonts(fontAssets)에서 함.
 */
export const fontFamily = {
  pretendardThin: 'Pretendard-Thin',
  pretendardExtraLight: 'Pretendard-ExtraLight',
  pretendardLight: 'Pretendard-Light',
  pretendardRegular: 'Pretendard-Regular',
  pretendardMedium: 'Pretendard-Medium',
  pretendardSemiBold: 'Pretendard-SemiBold',
  pretendardBold: 'Pretendard-Bold',
  pretendardExtraBold: 'Pretendard-ExtraBold',
  pretendardBlack: 'Pretendard-Black',
} as const;

export type FontFamily = (typeof fontFamily)[keyof typeof fontFamily];

/**
 * expo-font useFonts에 그대로 넘기는 폰트 파일 매핑.
 * 사용처: src/app/_layout.tsx
 */
export const fontAssets = {
  [fontFamily.pretendardThin]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Thin.otf'),
  [fontFamily.pretendardExtraLight]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-ExtraLight.otf'),
  [fontFamily.pretendardLight]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Light.otf'),
  [fontFamily.pretendardRegular]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Regular.otf'),
  [fontFamily.pretendardMedium]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Medium.otf'),
  [fontFamily.pretendardSemiBold]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-SemiBold.otf'),
  [fontFamily.pretendardBold]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Bold.otf'),
  [fontFamily.pretendardExtraBold]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-ExtraBold.otf'),
  [fontFamily.pretendardBlack]: require('@/assets/fonts/Pretendard-1.3.9/public/static/Pretendard-Black.otf'),
} as const;

// 메인, 서브1 폰트는 미확정
