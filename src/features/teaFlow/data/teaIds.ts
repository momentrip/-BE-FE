import type { TeaName } from "@/features/quote";

export const TEA_NAME_TO_ID = {
  국화차: "chrysanthemum",
  둥굴레차: "solomons-seal",
  "우전 녹차": "ujeon-green-tea",
  백차: "white-tea",
  옥수수수염차: "corn-tea",
  "세작 녹차": "sejak-green-tea",
  "중작 녹차": "jungjak-green-tea",
  감잎차: "persimmon-leaf-tea",
  오미자차: "omija",
  구기자차: "goji-berry-tea",
  대추차: "jujube-tea",
  쌍화차: "ssanghwa-tea",
  연꽃차: "lotus-flower-tea",
  매화차: "plum-blossom-tea",
  황차: "yellow-tea",
  잭살차: "jaeksal-tea",
  우엉차: "burdock-tea",
  쑥차: "mugwort-tea",
  뽕잎차: "mulberry-leaf-tea",
} as const satisfies Record<TeaName, string>;

export type TeaId = (typeof TEA_NAME_TO_ID)[TeaName];

export const TEA_ID_TO_NAME = Object.fromEntries(
  Object.entries(TEA_NAME_TO_ID).map(([name, id]) => [id, name]),
) as Record<TeaId, TeaName>;

export function getTeaId(name: TeaName): TeaId {
  return TEA_NAME_TO_ID[name];
}
