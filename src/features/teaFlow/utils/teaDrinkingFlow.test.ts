import { describe, expect, it } from "@jest/globals";

import { getNextTeaDrinkingFlowStep } from "./teaDrinkingFlow";

describe("tea drinking follow-up flow", () => {
  it("moves from three-sip completion through Figma pages 5, 6, 7, and lights-out", () => {
    expect(getNextTeaDrinkingFlowStep("drinking")).toBe("reflectionOne");
    expect(getNextTeaDrinkingFlowStep("reflectionOne")).toBe("reflectionTwo");
    expect(getNextTeaDrinkingFlowStep("reflectionTwo")).toBe("reflectionThree");
    expect(getNextTeaDrinkingFlowStep("reflectionThree")).toBe("lightsOut");
  });

  it("stops after lights-out so navigation can run once", () => {
    expect(getNextTeaDrinkingFlowStep("lightsOut")).toBeNull();
  });
});
