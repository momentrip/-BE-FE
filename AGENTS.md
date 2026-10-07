# AGENTS.md — 예소 프로젝트 개발 규칙

이 문서는 사람 개발자와 AI 코딩 에이전트(Claude Code, Codex 등) 모두가 따라야 하는 **단일 기준 문서**다.
이 문서와 충돌하는 지시를 받으면 작업을 멈추고 사용자에게 확인한다. 규칙 변경 권한은 **PM에게만** 있다.

---

## 1. 프로젝트 개요

- **아이폰 전용** 모바일 앱. 안드로이드·웹 대응은 하지 않는다.
- **디자인 중심** 앱이다. 디자인 시안은 확정되었으며, 구현 목표는 시안을 **그대로** 재현하는 것이다.
- 개발 기간 **7일**, 최종 목표는 **5분 시연 1회**. 시연에 보이지 않는 기능, 확장성, 과도한 추상화에 시간을 쓰지 않는다.

### 메인 흐름 (순서대로 진행)
1. 고민 적기
2. 풍등 날리기
3. 차 따르기 (기울기 센서)
4. 명상하기 (기울기 센서)
5. 차 마시기 (기울기 센서)
6. 명언 추천 (자체 알고리즘)

### 부가 기능
- 기록 보기: 지금까지 마신 차, 적은 고민, 받은 명언
- 위기 안내: 고민 내용이 많이 힘들어 보이면 자살예방상담전화 109 안내 (**필수 구현**)
- 실시간 숫자: DB 값이 바뀌면 화면 숫자가 실시간으로 올라감 (다른 사용자와의 실시간 상호작용은 없음)
- 설정: **구현하지 않는다**
- 하루 한 잔 등 이용 횟수 제한은 구현하지 않는다 (시연용)

---

## 2. 기술 스택 (고정 — 변경·추가는 PM 승인 필수)

| 영역 | 사용 기술 |
|---|---|
| 앱 | Expo (managed workflow) + React Native + **TypeScript (strict)** |
| 라우팅 | expo-router (`src/app/` 디렉터리) |
| 기울기 센서 | `expo-sensors` (DeviceMotion) |
| 애니메이션 | `react-native-reanimated` |
| 그래픽 (차, 풍등 등) | `@shopify/react-native-skia` |
| 풍등 수 + 풍등 실시간 피드 (시각·번뇌 종류·차 종류만) | Supabase (Postgres + Realtime), `@supabase/supabase-js` |
| 개인 기록 저장 | `expo-sqlite` (기기 로컬) |
| 테스트 | jest-expo |

- **Expo Go 호환성을 반드시 유지한다.** 커스텀 네이티브 모듈 추가, `expo prebuild` 실행, `ios/`·`android/` 커밋 금지.
- 위 표에 없는 라이브러리를 설치하지 않는다.
- 별도 백엔드 서버(Spring 등)는 만들지 않는다.

---

## 3. 폴더 구조

기준: **앱 흐름의 단계 하나 = 도메인 하나.** 여러 도메인이 같이 쓰는 것만 `shared/`에 둔다.

```
src/
  app/                # expo-router 화면과 흐름 순서. 도메인 컴포넌트를 조합만 한다 (로직 금지)
  features/
    worry/            # 고민 적기
    lantern/          # 풍등 날리기 + 다른 사용자 풍등 실시간 피드
    tea/              # 차 따르기 + 차 마시기 (액체 렌더링 공유)
    meditation/       # 명상하기
    quote/            # 명언 데이터 + 추천 알고리즘 + 번뇌 종류 자동 매칭 + 명언 화면
    session/          # 이번 회차 데이터(고민·차·명언) 보관 및 로컬 저장
    history/          # 내 기록 보기 (로컬)
    safety/           # 위기 감지 + 상담 전화 안내
  shared/
    sensors/          # useTilt 등 기울기 센서 (유일한 센서 구독 지점)
    theme/            # 디자인 토큰: colors, typography, spacing, radius
    ui/               # 도메인과 무관한 공용 컴포넌트
    lib/              # supabase.ts, 로컬 DB 연결 (유일한 생성 지점)
    constants/        # 여러 도메인이 같이 쓰는 고정 값 (번뇌 종류 id·묶음·표시 이름 등)
supabase/
  migrations/         # 스키마 변경 SQL
```

각 도메인 폴더 내부:

```
src/features/<domain>/
  index.ts        # ★ 공개 API. 다른 도메인은 이 파일만 import 가능
  types.ts
  components/
  hooks/
  logic/          # 순수 함수
  api/            # Supabase·로컬 DB 호출 (필요한 도메인만)
```

---

## 4. 도메인 분리 규칙 (가장 중요)

1. 다른 도메인은 `@/features/<domain>`(= `index.ts`)으로만 import한다.
   - 허용: `import { saveWorry } from '@/features/session';`
   - 금지: `import { x } from '@/features/session/logic/store';`
2. 같은 도메인 내부에서는 상대 경로로 import한다.
3. 의존 방향은 `app → features → shared` 한 방향. `shared`는 `features`를 import할 수 없다.
4. 도메인 간 순환 import 금지.
5. 다른 도메인 폴더 안의 파일을 직접 수정하지 않는다.
6. ESLint로 강제한다:

```js
// eslint.config.js 중
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['@/features/*/*'],
    message: '다른 도메인은 @/features/<domain> (index.ts)으로만 import하세요.',
  }],
}],
```

---

## 5. 도메인 간 함수 협의 절차

공개 함수는 미리 전부 정하지 않는다. **필요해질 때 해당 도메인 담당자와 협의해서 만든다.**

1. 다른 도메인의 기능이 필요하면, 그 도메인 `index.ts`에 이미 있는지 먼저 확인한다.
2. 없으면 그 도메인 담당자에게 **함수 이름, 입력, 출력**을 제안하고 합의한다.
3. 담당자는 합의한 시그니처로 **먼저 임시 구현(stub)을 export**해서 요청자가 바로 쓸 수 있게 한다. 실제 구현은 그 뒤에 채운다.
4. 요청자는 자기 도메인에 대신 구현하거나 복사하지 않는다.
5. `index.ts`로 공개하는 모든 함수에는 JSDoc 주석으로 **용도, 입력·출력, 사용하는 도메인**을 적는다. JSDoc은 **함수 정의 바로 위**에 단다 (에디터 hover에 보이도록). `index.ts`는 re-export만 한다.

```ts
/**
 * 이번 회차에 적은 고민을 저장한다.
 * @param text 사용자가 적은 고민
 * 사용처: worry
 */
export function saveWorry(text: string, kind: WorryKind): void { ... }
```

6. 이미 다른 도메인이 사용 중인 함수의 시그니처를 바꿀 때는 사용하는 도메인 담당자와 합의한다.

### 요청은 GitHub issue로 한다

- 함수 요청·시그니처 변경은 GitHub issue로 올린다 (템플릿: **함수 요청**).
- 제목: `[함수 요청] <도메인>: <함수명>`
- 본문: 함수명, 입력, 출력, 사용처(요청 도메인), 필요한 시점
- 해당 도메인 담당자를 Assignee로 지정한다. 합의는 issue 댓글로 남기고, 담당자는 stub PR 본문에 `Closes #<번호>`를 적는다.

### 함수 이름·모양 규칙

1. 이름은 동사로 시작하는 camelCase. 동사는 아래에서 고른다.
   - `get`: 값을 조회해 돌려준다 (`getLocalDb`, `getCurrentSession`)
   - `save`: 저장한다 (`saveWorry`)
   - 순수 계산은 하는 일을 그대로 쓴다: `filter` / `recommend` / `detect` / `match` (`filterAttitude`, `recommendQuote`)
   - `use`: React 훅 (`useTiltShared`)
2. 비동기 함수는 `Promise`를 반환하고, 이름에 `Async`를 붙이지 않는다.
3. 인자는 2개까지 순서대로 받고, 3개 이상이거나 선택 인자가 있으면 객체 하나로 받는다.
4. 타입은 PascalCase. 상태값은 문자열 리터럴 유니온으로 쓰고 `enum`은 쓰지 않는다. 공개 타입도 `index.ts`에서 `export type`으로 내보낸다.
5. 실패하면 throw한다. `null`은 "값이 없음"이 정상 결과일 때만 돌려준다.

---

## 6. 담당 영역

| 담당 | 도메인 |
|---|---|
| 신연아 | `tea`, `shared/sensors` |
| 노희윤 | `worry`, `lantern`, `meditation` |
| 박세인 | `session`, `history`, `safety`, `supabase/`, `shared/lib`, `shared/constants` |
| 유민아 | `quote` (`quote/data`는 C도 수정 가능) |

- `src/app/`(화면 순서)과 `shared/theme`, `shared/ui`는 수정 시 PR에 PM을 리뷰어로 지정한다.
- 알고리즘 로직(`features/quote/logic`: 명언 추천, 번뇌 종류 자동 매칭)은 D만 작성한다.

---

## 7. 코드 작성 규칙

- TypeScript `strict`. `any`, `@ts-ignore` 금지 (불가피하면 이유를 주석으로 남긴다).
- 함수형 컴포넌트 + 훅. named export (expo-router 화면 파일의 default export만 예외).
- 파일명: 컴포넌트 `PascalCase.tsx`, 그 외 `camelCase.ts`.
- 식별자는 영어, 주석은 한국어 허용.
- 시연에 필요 없는 일반화·추상화 금지.

### 디자인 구현
- 색상·폰트·간격·radius는 반드시 `shared/theme` 토큰을 사용한다. hex 값이나 매직 넘버를 직접 쓰지 않는다.
- 디자인 시안에 없는 UI 요소, 색, 애니메이션을 임의로 추가하거나 바꾸지 않는다.
- 시안과 다르게 구현해야 하면 PR에 이유와 스크린샷을 남기고 PM 승인을 받는다.

---

## 8. 센서·애니메이션 규칙

- 기울기는 `shared/sensors`의 훅으로만 받는다. 도메인에서 `DeviceMotion`을 직접 구독하지 않는다.
- 업데이트 간격 약 16ms, 원시 값은 로우패스 필터를 거쳐 노출한다.
- 센서 값은 Reanimated `SharedValue`로 전달한다. 센서 프레임마다 `setState` 호출 금지.
- 각도 구간 판정 기준값은 한 곳에 상수로 두고, 화면마다 하드코딩하지 않는다.
- 차 표면은 기울기만큼 반대로 회전시켜 항상 수평으로 보이게 한다.
- 구독·애니메이션은 언마운트 시 정리한다.
- **iOS 시뮬레이터에는 기울기 센서가 없다.** 센서 관련 작업은 실제 아이폰(Expo Go)에서 확인한다.

---

## 9. 데이터 저장 규칙

- **고민 내용과 받은 명언은 기기 로컬(`expo-sqlite`)에만 저장하고 Supabase로 보내지 않는다.** 고른 차는 로컬 기록과 `lanterns` 양쪽에 저장한다. 기록 보기 화면은 내 기록만 보여준다.
- 명언 목록은 DB가 아니라 `src/features/quote/data`의 데이터 파일에 둔다. 로컬 기록에는 `quote_id`만 저장하고 데이터 파일에서 찾는다.
- 다른 사용자와 공유하는 것은 "언제, 어떤 번뇌 종류의 풍등을, 어떤 차와 함께 날렸는지"뿐이다. Supabase `lanterns` 테이블에는 `created_at`, `worry_kind`, `tea`만 저장한다.
- 한 회차가 끝나면 로컬 DB에 내 기록 전체를, `lanterns`에 `created_at`·`worry_kind`·`tea`만 저장한다.
- `lanterns`는 RLS를 켜고 INSERT·SELECT 정책만 열며, `supabase_realtime` publication에 추가한다. 앱에서 수정·삭제 기능은 만들지 않는다.
- 화면에 띄울 풍등 수는 **오늘(기기 시간대 자정 이후)** 날린 `lanterns` 행 개수다. 누적 개수는 쓰지 않는다. 화면 진입 시 오늘 개수를 한 번 조회하고, INSERT 이벤트마다 +1 하며, 자정이 지나면 다시 조회한다.
- 다른 사용자의 풍등은 `lanterns` INSERT 구독으로 실시간 피드("n분 전 · 불안·걱정 · 캐모마일")로 보여준다.
- 오늘 차를 마셨는지는 로컬 `my_records`에 오늘(기기 시간대 자정 이후) 기록이 있는지로 판단한다. 별도 컬럼이나 테이블을 두지 않는다.
- `tea` 값은 `tea` 도메인이 정한 차 id를 그대로 쓴다. 차 이름 등 화면 표시는 앱 코드에서 id로 찾는다.
- 번뇌 종류 `worry_kind` id는 아래 8개다. 탐·진·치 묶음 매핑과 화면 표시 이름은 `src/shared/constants`의 상수 한 곳에서만 관리한다.
  - 탐: `greed_impatience`, `wavering_temptation`
  - 진: `relationship_anger`, `selfblame_lethargy`
  - 치: `anxiety_worry`, `overthinking`, `career_direction`
  - `unsure`
- Supabase·로컬 DB 클라이언트 생성은 `shared/lib`에서만 한다. 호출은 각 도메인 `api/`에서만 한다.
- 환경 변수: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`. `.env` 커밋 금지, `.env.example`만 커밋한다.
- `service_role` 키는 레포 어디에도 넣지 않는다.
- 실시간 구독은 언마운트 시 채널을 해제한다.
- 스키마 변경은 `supabase/migrations/`에 SQL로 남긴다.

---

## 10. 명언 추천 알고리즘 규칙

- 방식: 명언마다 태그(`themes`, `tone`, `teas` 등)를 달고, 사용자 입력과의 일치도로 점수를 매겨 최고점을 고른다.
- 명언 데이터의 `themes` 태그는 `worry_kind` id를 그대로 사용한다.
- `recommendQuote`는 **순수 함수**: 같은 입력이면 같은 출력, 네트워크·DB·전역 상태 변경 없음.
- 랜덤 요소는 seed를 입력으로 받는다 (시연 재현성).
- 결과가 비는 경우가 없어야 한다. 항상 기본 명언 fallback을 둔다.
- 위기 상황으로 판단된 입력에는 무겁거나 어두운 명언을 고르지 않는다 (`safety`와 기준 공유).
- 명언 데이터에는 출처와 말한 사람을 기록하고, 저작권 문제가 없는 문구만 사용한다.
- `logic/`의 함수는 jest 단위 테스트를 작성한다.

### 번뇌 종류 자동 매칭

- 고민 텍스트로 `worry_kind`를 자동으로 고르고, 사용자는 고민 적기 화면에서 결과를 바꿀 수 있다.
- **기기 안의 키워드 매칭**으로 한다. 외부 LLM·API를 쓰지 않는다 (고민 내용은 기기 밖으로 보내지 않는다, 9장).
- 방식: `worry_kind`마다 키워드 목록을 두고, 텍스트에 들어 있는 키워드 수로 점수를 매겨 최고점을 고른다. 일치가 없으면 `unsure`.
- 추천 알고리즘과 같은 규칙을 따른다: 순수 함수, 동점 처리 규칙을 고정해 같은 입력이면 같은 출력, jest 단위 테스트 작성.
- 시연에 쓸 고민 문장은 의도한 종류로 매칭되는지 테스트 케이스로 고정한다.

---

## 11. 위기 안내 규칙

- 고민 텍스트에서 위기 표현이 감지되면 흐름을 강제로 끊지 않고 부드럽게 109 안내를 보여준다.
- 감지는 놓칠 수 있으므로, 감지와 별개로 항상 접근 가능한 고정 안내(예: 기록 보기 화면)를 둔다.
- 안내 문구는 겁주거나 단정하지 않고 따뜻하게 쓴다.
- 고민 내용은 기기 밖으로 전송하지 않는다 (9장).

---

## 12. Git 규칙

- `main` 직접 push 금지. PR + 리뷰 1명 이상 + squash merge.
- 브랜치명: `feat/<domain>-<설명>`, `fix/<domain>-<설명>` (예: `feat/tea-pour-wave`)
- 커밋 메시지: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`, `test:` + 한국어 설명
- **PR 하나는 도메인 하나만 수정한다.** (협의로 만든 공개 함수 추가는 그 도메인 담당자의 PR로 올린다)
- UI 변경 PR에는 실기기 스크린샷/영상을 첨부한다.
- `AGENTS.md`, `CLAUDE.md`는 PM만 수정한다.

---

## 13. 일정과 기능 동결

| 일차 | 목표 |
|---|---|
| 1 | 레포 세팅, 각자 Expo Go 실행 확인, 기울기+차 프로토타입(실기기), Supabase 세팅 (풍등 피드 실시간 확인), 로컬 DB 세팅, 명언 데이터 구조 |
| 2 | 차 따르기, 고민 적기·풍등, session 저장, 추천 v1 |
| 3 | 1차 통합, 차 마시기·각도별 분기, 명상, 기록 보기 |
| 4 | 기능 완성, 위기 안내, 추천 개선, 애니메이션 다듬기 |
| 5 | **오후 기능 동결**, 전체 흐름 실기기 반복 테스트 |
| 6 | 버그 수정, 시안 대조, 시연용 Release 빌드 설치 |
| 7 | 리허설, 백업 영상, 버퍼 |

- 5일차 기능 동결 이후에는 버그 수정과 디자인 맞추기만 한다.

---

## 14. 완료 기준 (Definition of Done)

- [ ] `npx tsc --noEmit` 통과
- [ ] `npx expo lint` 통과
- [ ] 알고리즘 변경 시 `npx jest` 통과
- [ ] 실제 아이폰 Expo Go에서 동작 확인 (UI·센서·애니메이션 변경 시)
- [ ] 디자인 시안과 대조 (UI 변경 시)
- [ ] 디버그용 `console.log` 제거

---

## 15. AI 코딩 에이전트 전용 규칙

1. 작업 시작 전 **어느 도메인의 작업인지** 판단하고, 그 도메인 폴더 밖은 수정하지 않는다.
2. 다른 도메인의 기능이 필요하면 그 도메인 `index.ts`를 확인한다. 없으면 **직접 구현하거나 복사하지 말고 작업을 멈춘 뒤**, 필요한 함수의 이름·입력·출력 제안을 사용자에게 보여주고 "해당 도메인 담당자와 협의가 필요하다"고 알린다. 제안은 5장의 이름·모양 규칙을 따르고, 바로 올릴 수 있는 GitHub issue 본문 형태로 작성한다 (5장).
3. 사용자가 해당 도메인 담당자라고 밝히고 공개 함수 추가를 요청하면, `index.ts`에 JSDoc(용도, 입력·출력, 사용처)과 함께 export한다.
4. 이미 export된 함수의 시그니처를 사용자의 명시적 지시 없이 바꾸지 않는다.
5. 패키지 설치, `package.json` 의존성 변경, `expo prebuild` 실행을 하지 않는다. 필요하면 제안만 한다.
6. 디자인 토큰 값과 시안에 정의된 UI를 임의로 변경하지 않는다.
7. 고민 내용·명언 등 개인 기록을 Supabase나 외부로 전송하는 코드를 작성하지 않는다. Supabase에는 lanterns(created_at, worry_kind, tea)만 보낸다.
8. 요청받은 범위만 수정한다. 관련 없는 리팩터링·포맷팅 변경 금지.
9. 작업을 마치기 전 14장의 자동 검사를 실행하고 결과를 보고한다. 실기기 확인이 필요한 변경이면 사람이 확인해야 한다고 명시한다.
10. 요구사항이 모호하거나 이 문서와 충돌하면 추측하지 말고 질문한다.
11. `.env`, 키, 토큰을 출력하거나 커밋하지 않는다.

---

## 16. Expo 작업 시 참고

Expo는 SDK마다 API가 바뀐다. 기억(학습 데이터)에 의존하지 말고, Expo·EAS·React Native API를 다루기 전에 버전별 공식 문서를 확인한다.

1. `package.json`의 `expo` 패키지 메이저 버전을 확인한다.
2. 해당 버전 문서를 확인한다: `https://docs.expo.dev/versions/v<major>.0.0/`
3. 그 외 궁금한 내용은 `https://docs.expo.dev/llms.txt`(전체 문서 색인, 흔한 오해 교정 포함)에서 관련 링크를 따라간다. 기억으로 답하지 않는다.

### 자주 쓰는 명령어

```bash
npx expo install <package>  # 패키지 설치 시 항상 이것을 사용 (npm/yarn/pnpm/bun add 금지) — SDK에 맞는 버전을 알아서 선택
npx expo start              # 개발 서버 시작
npx expo lint               # lint
npx tsc --noEmit            # 타입 체크
npx expo-doctor             # 의존성·설정 문제 진단
npx expo install --fix      # 버전이 안 맞는 패키지 수정
```

작업을 완료로 표시하기 전 lint와 typecheck를 실행한다.

### 기타 규칙

- `ios/`, `android/` 폴더가 없는 것이 정상이다 (Continuous Native Generation). 직접 만들거나 수정하지 않는다. 네이티브 동작은 `app.json`과 config plugin으로만 설정한다.
- Expo Go는 자체에 내장된 네이티브 모듈만 지원한다. 네이티브 코드가 있는 라이브러리를 추가하면 development build(`npx expo run:ios|android`, `eas build --profile development`)가 필요해진다 — 이 프로젝트는 Expo Go 호환을 유지해야 하므로(2장) 그런 라이브러리를 추가하지 않는다.
