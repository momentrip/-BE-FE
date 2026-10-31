import { describe, expect, it } from "@jest/globals";

import { getNextTeaDrinkingFlowStep } from "./teaDrinkingFlow";

describe("tea drinking follow-up flow", () => {
  it("moves from three-sip completion through Figma pages 5, 6, and 7", () => {
    expect(getNextTeaDrinkingFlowStep("drinking")).toBe("reflectionOne");
    expect(getNextTeaDrinkingFlowStep("reflectionOne")).toBe("reflectionTwo");
    expect(getNextTeaDrinkingFlowStep("reflectionTwo")).toBe("reflectionThree");
  });

  it("stops after the last reflection so navigation can run once", () => {
    expect(getNextTeaDrinkingFlowStep("reflectionThree")).toBeNull();
  });
});
