import { describe, expect, it } from "@jest/globals";
import {
  averageQuaternions,
  calculateRelativeOrientation,
  eulerAttitudeToQuaternion,
  normalizeQuaternion,
} from "./orientation";
import type { Quaternion } from "./orientation";

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const identity: Quaternion = { x: 0, y: 0, z: 0, w: 1 };

function multiply(left: Quaternion, right: Quaternion): Quaternion {
  return {
    x: left.w * right.x + left.x * right.w + left.y * right.z - left.z * right.y,
    y: left.w * right.y - left.x * right.z + left.y * right.w + left.z * right.x,
    z: left.w * right.z + left.x * right.y - left.y * right.x + left.z * right.w,
    w: left.w * right.w - left.x * right.x - left.y * right.y - left.z * right.z,
  };
}

describe("Euler attitude to quaternion", () => {
  it("maps Expo alpha/beta/gamma radians to Z/X/Y axis rotations", () => {
    const halfAngle = Math.sin(Math.PI / 4);
    const alpha = eulerAttitudeToQuaternion({ alpha: Math.PI / 2, beta: 0, gamma: 0 });
    const beta = eulerAttitudeToQuaternion({ alpha: 0, beta: Math.PI / 2, gamma: 0 });
    const gamma = eulerAttitudeToQuaternion({ alpha: 0, beta: 0, gamma: Math.PI / 2 });

    expect(alpha?.z).toBeCloseTo(halfAngle);
    expect(alpha?.w).toBeCloseTo(halfAngle);
    expect(beta?.x).toBeCloseTo(halfAngle);
    expect(beta?.w).toBeCloseTo(halfAngle);
    expect(gamma?.y).toBeCloseTo(halfAngle);
    expect(gamma?.w).toBeCloseTo(halfAngle);
  });

  it("normalizes the result and rejects non-finite Euler values", () => {
    const result = eulerAttitudeToQuaternion({ alpha: 1, beta: 2, gamma: 3 });
    expect(result).not.toBeNull();
    expect(Math.hypot(result!.x, result!.y, result!.z, result!.w)).toBeCloseTo(1);
    expect(eulerAttitudeToQuaternion({ alpha: Number.NaN, beta: 0, gamma: 0 })).toBeNull();
  });
});

describe("quaternion baseline and relative rotation", () => {
  it("normalizes valid quaternions and rejects invalid or zero values", () => {
    expect(normalizeQuaternion({ x: 0, y: 0, z: 0, w: 2 })).toEqual(identity);
    expect(normalizeQuaternion({ x: 0, y: 0, z: 0, w: 0 })).toBeNull();
    expect(normalizeQuaternion({ x: 0, y: 0, z: Number.POSITIVE_INFINITY, w: 1 })).toBeNull();
  });

  it("averages q and -q as the same orientation", () => {
    expect(averageQuaternions([identity, { x: 0, y: 0, z: 0, w: -1 }])).toEqual(identity);
    expect(averageQuaternions([])).toBeNull();
  });

  it("finds relative rotation and baseline-local twist on each axis", () => {
    const baseline = eulerAttitudeToQuaternion({
      alpha: degreesToRadians(60),
      beta: degreesToRadians(30),
      gamma: degreesToRadians(-20),
    });
    const gesture = eulerAttitudeToQuaternion({ alpha: 0, beta: 0, gamma: degreesToRadians(25) });
    expect(baseline).not.toBeNull();
    expect(gesture).not.toBeNull();

    const result = calculateRelativeOrientation(baseline!, multiply(baseline!, gesture!));
    expect(result?.angleDegrees).toBeCloseTo(25);
    expect(result?.axis?.y).toBeCloseTo(1);
    expect(result?.twistDegrees.y).toBeCloseTo(25);
  });

  it("treats q and -q as equal and handles Euler wrap by shortest rotation", () => {
    const same = calculateRelativeOrientation(identity, { x: 0, y: 0, z: 0, w: -1 });
    expect(same?.angleDegrees).toBeCloseTo(0);
    expect(same?.axis).toBeNull();

    const baseline = eulerAttitudeToQuaternion({ alpha: degreesToRadians(179), beta: 0, gamma: 0 });
    const current = eulerAttitudeToQuaternion({ alpha: degreesToRadians(-179), beta: 0, gamma: 0 });
    const wrapped = calculateRelativeOrientation(baseline!, current!);
    expect(wrapped?.angleDegrees).toBeCloseTo(2);
    expect(wrapped?.axis?.z).toBeCloseTo(1);
  });

  it("returns null for invalid relative quaternion inputs", () => {
    expect(calculateRelativeOrientation({ x: 0, y: 0, z: 0, w: 0 }, identity)).toBeNull();
  });
});
