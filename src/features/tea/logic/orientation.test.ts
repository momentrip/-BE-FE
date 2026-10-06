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

describe("eulerAttitudeToQuaternion", () => {
  it("maps Expo alpha/beta/gamma to Z/X/Y axis rotations in radians", () => {
    const halfAngle = Math.sin(Math.PI / 4);
    const alphaRotation = eulerAttitudeToQuaternion({ alpha: Math.PI / 2, beta: 0, gamma: 0 });
    const betaRotation = eulerAttitudeToQuaternion({ alpha: 0, beta: Math.PI / 2, gamma: 0 });
    const gammaRotation = eulerAttitudeToQuaternion({ alpha: 0, beta: 0, gamma: Math.PI / 2 });

    expect(alphaRotation?.x).toBeCloseTo(0);
    expect(alphaRotation?.y).toBeCloseTo(0);
    expect(alphaRotation?.z).toBeCloseTo(halfAngle);
    expect(alphaRotation?.w).toBeCloseTo(halfAngle);
    expect(betaRotation?.x).toBeCloseTo(halfAngle);
    expect(betaRotation?.y).toBeCloseTo(0);
    expect(betaRotation?.z).toBeCloseTo(0);
    expect(betaRotation?.w).toBeCloseTo(halfAngle);
    expect(gammaRotation?.x).toBeCloseTo(0);
    expect(gammaRotation?.y).toBeCloseTo(halfAngle);
    expect(gammaRotation?.z).toBeCloseTo(0);
    expect(gammaRotation?.w).toBeCloseTo(halfAngle);
  });

  it("normalizes the orientation and rejects non-finite angles", () => {
    const quaternion = eulerAttitudeToQuaternion({ alpha: 1, beta: 2, gamma: 3 });
    expect(quaternion).not.toBeNull();
    expect(Math.hypot(quaternion!.x, quaternion!.y, quaternion!.z, quaternion!.w)).toBeCloseTo(1);
    expect(eulerAttitudeToQuaternion({ alpha: Number.NaN, beta: 0, gamma: 0 })).toBeNull();
  });
});

describe("quaternion normalization and baseline averaging", () => {
  it("normalizes finite quaternions and rejects invalid or zero quaternions", () => {
    expect(normalizeQuaternion({ x: 0, y: 0, z: 0, w: 2 })).toEqual(identity);
    expect(normalizeQuaternion({ x: 0, y: 0, z: 0, w: 0 })).toBeNull();
    expect(normalizeQuaternion({ x: 0, y: 0, z: Number.POSITIVE_INFINITY, w: 1 })).toBeNull();
  });

  it("averages q and -q as the same orientation", () => {
    expect(averageQuaternions([identity, { x: 0, y: 0, z: 0, w: -1 }])).toEqual(identity);
    expect(averageQuaternions([])).toBeNull();
  });
});

describe("calculateRelativeOrientation", () => {
  it("extracts relative device-local rotation and signed twist around each axis", () => {
    const baseline = eulerAttitudeToQuaternion({
      alpha: degreesToRadians(60),
      beta: degreesToRadians(30),
      gamma: degreesToRadians(-20),
    });
    const localGesture = eulerAttitudeToQuaternion({ alpha: 0, beta: 0, gamma: degreesToRadians(25) });
    expect(baseline).not.toBeNull();
    expect(localGesture).not.toBeNull();

    const current = multiply(baseline!, localGesture!);
    const relative = calculateRelativeOrientation(baseline!, current);

    expect(relative?.angleDegrees).toBeCloseTo(25);
    expect(relative?.axis?.x).toBeCloseTo(0);
    expect(relative?.axis?.y).toBeCloseTo(1);
    expect(relative?.axis?.z).toBeCloseTo(0);
    expect(relative?.twistDegrees.x).toBeCloseTo(0);
    expect(relative?.twistDegrees.y).toBeCloseTo(25);
    expect(relative?.twistDegrees.z).toBeCloseTo(0);
  });

  it("extracts positive and negative signed twist for each baseline-local axis", () => {
    const axisCases = [
      { axis: "x", attitude: { alpha: 0, beta: degreesToRadians(30), gamma: 0 } },
      { axis: "y", attitude: { alpha: 0, beta: 0, gamma: degreesToRadians(30) } },
      { axis: "z", attitude: { alpha: degreesToRadians(30), beta: 0, gamma: 0 } },
    ] as const;

    for (const { axis, attitude } of axisCases) {
      const positive = eulerAttitudeToQuaternion(attitude);
      const negative = eulerAttitudeToQuaternion({
        alpha: -attitude.alpha,
        beta: -attitude.beta,
        gamma: -attitude.gamma,
      });
      const positiveRelative = calculateRelativeOrientation(identity, positive!);
      const negativeRelative = calculateRelativeOrientation(identity, negative!);

      expect(positiveRelative?.twistDegrees[axis]).toBeCloseTo(30);
      expect(negativeRelative?.twistDegrees[axis]).toBeCloseTo(-30);
    }
  });

  it("treats current q and -q as equivalent and reports no rotation", () => {
    const relative = calculateRelativeOrientation(identity, { x: 0, y: 0, z: 0, w: -1 });
    expect(relative?.angleDegrees).toBeCloseTo(0);
    expect(relative?.axis).toBeNull();
    expect(relative?.twistDegrees.x).toBeCloseTo(0);
    expect(relative?.twistDegrees.y).toBeCloseTo(0);
    expect(relative?.twistDegrees.z).toBeCloseTo(0);
  });

  it("uses the shortest rotation when Euler yaw wraps across plus/minus pi", () => {
    const baseline = eulerAttitudeToQuaternion({
      alpha: degreesToRadians(179),
      beta: 0,
      gamma: 0,
    });
    const current = eulerAttitudeToQuaternion({
      alpha: degreesToRadians(-179),
      beta: 0,
      gamma: 0,
    });
    const relative = calculateRelativeOrientation(baseline!, current!);

    expect(relative?.angleDegrees).toBeCloseTo(2);
    expect(relative?.axis?.z).toBeCloseTo(1);
  });

  it("returns null when either input quaternion is invalid", () => {
    expect(calculateRelativeOrientation({ x: 0, y: 0, z: 0, w: 0 }, identity)).toBeNull();
  });
});