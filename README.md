# -BE-FE (예소)

다선일미의 백엔드와 프론트엔드 개발용 레포지토리입니다.

아이폰 전용 Expo(React Native) 앱입니다. 개발 규칙·폴더 구조·담당 영역은 [AGENTS.md](./AGENTS.md)를 따릅니다.

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. `.env.example`을 복사해 `.env`를 만들고 Supabase 값을 채운다.

   ```bash
   cp .env.example .env
   ```

3. 개발 서버 시작

   ```bash
   npx expo start
   ```

4. 아이폰에서 **Expo Go** 앱으로 QR 코드를 스캔해 실행한다. (기울기 센서는 시뮬레이터에서 동작하지 않으므로 반드시 실기기로 확인한다.)

## 기술 스택

Expo(managed) + React Native + TypeScript, expo-router, expo-sensors, react-native-reanimated, @shopify/react-native-skia, Supabase(Postgres + Realtime), expo-sqlite, jest-expo. 자세한 내용과 규칙은 [AGENTS.md](./AGENTS.md)를 참고한다.

## 검증

```bash
npm run typecheck
npm run lint
npm run test
```
