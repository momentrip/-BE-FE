import { useEffect, useState } from "react";
import { DeviceMotion } from "expo-sensors";
import { useSharedValue } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { filterAttitude } from "./attitudeFilter";
import type { AttitudeValues } from "./attitudeFilter";

export type TiltSensorStatus = "initializing" | "ready" | "unavailable" | "error";

export type TiltSharedReading = {
  attitude: SharedValue<AttitudeValues | null>;
  status: TiltSensorStatus;
};

const DEVICE_MOTION_UPDATE_INTERVAL_MS = 16;

/**
 * DeviceMotion 자세를 16ms 간격으로 구독하고 low-pass filter된 라디안 값을 SharedValue로 제공한다.
 * @returns attitude(alpha/beta/gamma/timestamp) SharedValue와 초기화·가용성 상태
 * 사용처: tea 및 다른 센서 기반 도메인. 센서 구독은 이 hook에서만 수행한다.
 */
export function useTiltShared(): TiltSharedReading {
  const attitude = useSharedValue<AttitudeValues | null>(null);
  const [status, setStatus] = useState<TiltSensorStatus>("initializing");

  useEffect(() => {
    let isActive = true;
    let subscription: ReturnType<typeof DeviceMotion.addListener> | null = null;
    let previousAttitude: AttitudeValues | null = null;

    const startListening = async () => {
      try {
        const isAvailable = await DeviceMotion.isAvailableAsync();
        if (!isActive) {
          return;
        }

        if (!isAvailable) {
          setStatus("unavailable");
          return;
        }

        DeviceMotion.setUpdateInterval(DEVICE_MOTION_UPDATE_INTERVAL_MS);
        subscription = DeviceMotion.addListener(({ rotation }) => {
          if (!isActive) {
            return;
          }

          const filteredAttitude = filterAttitude(previousAttitude, {
            alpha: rotation.alpha,
            beta: rotation.beta,
            gamma: rotation.gamma,
            timestamp: rotation.timestamp,
          });
          if (filteredAttitude !== previousAttitude && filteredAttitude !== null) {
            previousAttitude = filteredAttitude;
            attitude.value = filteredAttitude;
          }
        });
        setStatus("ready");
      } catch {
        if (isActive) {
          setStatus("error");
        }
      }
    };

    void startListening();

    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, [attitude]);

  return { attitude, status };
}