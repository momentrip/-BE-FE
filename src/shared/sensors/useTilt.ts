import { useEffect, useState } from "react";
import { DeviceMotion } from "expo-sensors";

export type TiltStatus = "initializing" | "ready" | "unavailable" | "error";

export type DeviceAttitudeReading = {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  timestamp: number | null;
  status: TiltStatus;
};

export type TiltReading = DeviceAttitudeReading;

const DEVICE_MOTION_UPDATE_INTERVAL_MS = 100;

/**
 * DeviceMotion의 raw alpha/beta/gamma attitude와 timestamp를 라디안 단위로 제공한다.
 */
export function useTilt(): DeviceAttitudeReading {
  const [reading, setReading] = useState<DeviceAttitudeReading>({
    alpha: null,
    beta: null,
    gamma: null,
    timestamp: null,
    status: "initializing",
  });

  useEffect(() => {
    let isActive = true;
    let subscription: ReturnType<typeof DeviceMotion.addListener> | null = null;

    const startListening = async () => {
      try {
        const isAvailable = await DeviceMotion.isAvailableAsync();
        if (!isActive) {
          return;
        }

        if (!isAvailable) {
          setReading({ alpha: null, beta: null, gamma: null, timestamp: null, status: "unavailable" });
          return;
        }

        DeviceMotion.setUpdateInterval(DEVICE_MOTION_UPDATE_INTERVAL_MS);
        subscription = DeviceMotion.addListener(({ rotation }) => {
          if (!isActive) {
            return;
          }

          setReading({
            alpha: rotation.alpha,
            beta: rotation.beta,
            gamma: rotation.gamma,
            timestamp: rotation.timestamp,
            status: "ready",
          });
        });
      } catch {
        if (isActive) {
          setReading({ alpha: null, beta: null, gamma: null, timestamp: null, status: "error" });
        }
      }
    };

    void startListening();

    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, []);

  return reading;
}