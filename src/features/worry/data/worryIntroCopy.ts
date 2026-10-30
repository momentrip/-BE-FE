export type WorryIntroPanel = {
  number: string;
  quote: string;
  caption: string;
};

export type WorryIntroCopy = {
  title: string;
  top: WorryIntroPanel;
  bottom: WorryIntroPanel;
};

/** Figma s2 Flow1의 01/02 안내 화면 문구. */
export const WORRY_INTRO_1: WorryIntroCopy = {
  title: "다선의 시간",
  top: {
    number: "01",
    quote: "차 한 잔으로, 마음을 바라봅니다.",
    caption: "잠시 멈추고\n지금 내 마음에 머무는 생각을 느껴보세요.",
  },
  bottom: {
    number: "02",
    quote: "번뇌를 없애려 하지 않아도 괜찮습니다.",
    caption: "걱정도, 미움도, 불안도\n먼저 알아차리는 것에서 시작합니다.",
  },
};

/** Figma s2 Flow1의 03/04 안내 화면 문구. */
export const WORRY_INTRO_2: WorryIntroCopy = {
  title: "다선의 시간",
  top: {
    number: "03",
    quote: "한 잔의 차가 우러나는 동안,\n마음도 천천히 가라앉습니다.",
    caption: "들이쉬고, 내쉬며\n붙잡고 있던 생각에서 잠시 멀어져 봅니다.",
  },
  bottom: {
    number: "04",
    quote: "이제, 당신의 번뇌를 적어주세요.",
    caption: "당신의 마음에 맞는 불교의 가르침과\n차 한 잔을 함께 건네드릴게요.",
  },
};
