import { useCallback, useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors";
import { useSharedValue } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

import { calculateImpactMagnitude } from "./impactMagnitude";

export type ImpactSensorStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "denied"
  | "unavailable"
  | "error";

export type ImpactSharedReading = {
  impactMagnitude: SharedValue<number>;
  requestPermission: () => Promise<boolean>;
  status: ImpactSensorStatus;
};

type UseImpactSharedOptions = {
  enabled: boolean;
};

const IMPACT_UPDATE_INTERVAL_MS = 16;

/**
 * Accelerometer 충격 크기를 16ms 간격의 SharedValue로 제공하고 센서 권한을 요청한다.
 * @param options.enabled true일 때 권한이 허용된 Accelerometer 구독을 시작한다.
 * @returns 충격 크기, 권한 요청 함수, 센서 상태
 * 사용처: teaFlow S3 찻잎 두드리기
 */
export function useImpactShared({ enabled }: UseImpactSharedOptions): ImpactSharedReading {
  const impactMagnitude = useSharedValue(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [status, setStatus] = useState<ImpactSensorStatus>("idle");

  const requestPermission = useCallback(async () => {
    setStatus("requesting");

    try {
      const isAvailable = await Accelerometer.isAvailableAsync();
      if (!isAvailable) {
        setStatus("unavailable");
        return false;
      }

      const permission = await Accelerometer.requestPermissionsAsync();
      if (!permission.granted) {
        setStatus("denied");
        return false;
      }

      setPermissionGranted(true);
      setStatus("ready");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !permissionGranted) {
      impactMagnitude.value = 0;
      return;
    }

    Accelerometer.setUpdateInterval(IMPACT_UPDATE_INTERVAL_MS);
    const subscription = Accelerometer.addListener((sample) => {
      impactMagnitude.value = calculateImpactMagnitude(sample);
    });

    return () => {
      subscription.remove();
      impactMagnitude.value = 0;
    };
  }, [enabled, impactMagnitude, permissionGranted]);

  return { impactMagnitude, requestPermission, status };
}
