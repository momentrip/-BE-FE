import { StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "expo-router";
import { useTilt } from "@/shared/sensors";
import {
  getZTwistPouringState,
  usePouringState,
  useRelativeOrientation,
} from "@/features/tea";

const RADIANS_TO_DEGREES = 180 / Math.PI;

function formatDegrees(value: number | null): string {
  return value === null ? "--" : `${(value * RADIANS_TO_DEGREES).toFixed(2)}°`;
}

export default function TiltTestScreen() {
  const isFocused = useIsFocused();
  return <TiltTestSession key={isFocused ? "focused" : "unfocused"} />;
}

function TiltTestSession() {
  const tilt = useTilt();
  const legacyPouring = usePouringState({
    pitch: tilt.beta === null ? null : tilt.beta * RADIANS_TO_DEGREES,
    roll: tilt.gamma === null ? null : tilt.gamma * RADIANS_TO_DEGREES,
    status: tilt.status,
  });
  const relativeOrientation = useRelativeOrientation(tilt);
  const baseline = relativeOrientation.baselineQuaternion;
  const relative = relativeOrientation.relative;
  const zTwistState = getZTwistPouringState(relative?.twistDegrees.z ?? null);

  return (
    <View style={styles.container}>
      <Text>Current α/β/γ: {formatDegrees(tilt.alpha)} / {formatDegrees(tilt.beta)} / {formatDegrees(tilt.gamma)}</Text>
      <Text>Sensor timestamp: {tilt.timestamp ?? "--"}</Text>
      <Text>A calibration: {legacyPouring.calibrationStatus}</Text>
      <Text>A baseline roll: {legacyPouring.baselineRoll?.toFixed(2) ?? "--"}°</Text>
      <Text>A delta roll: {legacyPouring.deltaRoll?.toFixed(2) ?? "--"}°</Text>
      <Text>A state/direction: {legacyPouring.status} / {legacyPouring.direction}</Text>
      <Text>B calibration: {relativeOrientation.calibrationStatus}</Text>
      <Text>
        B baseline q (x,y,z,w): {baseline === null
          ? "--"
          : `${baseline.x.toFixed(3)}, ${baseline.y.toFixed(3)}, ${baseline.z.toFixed(3)}, ${baseline.w.toFixed(3)}`}
      </Text>
      <Text>B relative angle: {relative?.angleDegrees.toFixed(2) ?? "--"}°</Text>
      <Text>
        B relative axis (x,y,z): {relative?.axis === null || relative === null
          ? "--"
          : `${relative.axis.x.toFixed(3)}, ${relative.axis.y.toFixed(3)}, ${relative.axis.z.toFixed(3)}`}
      </Text>
      <Text>B X twist: {relative?.twistDegrees.x.toFixed(2) ?? "--"}°</Text>
      <Text>B Y twist: {relative?.twistDegrees.y.toFixed(2) ?? "--"}°</Text>
      <Text>B Z twist: {relative?.twistDegrees.z.toFixed(2) ?? "--"}°</Text>
      <Text>B Z twist state/direction: {zTwistState.status} / {zTwistState.direction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});