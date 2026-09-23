export const PHOENIX_ALBERTA = {
  business: "phoenix",
  businessLabel: "Phoenix Chimney & Fireplace",
  province: "AB",
  provinceLabel: "Alberta",
  importsOntario: false,
  sourceLabels: [
    "WETT common methodology",
    "National Building Code — 2023 Alberta Edition",
    "National Fire Code — 2023 Alberta Edition",
    "CSA B365-17 as the Alberta-referenced edition",
    "CAN/ULC-S610:2018",
    "ULC-S628-93",
    "CAN/ULC-S629:2016",
    "CAN/ULC-S639-M87 where applicable",
  ],
} as const;

export function isAlbertaProvince(value: string | undefined) {
  const province = value?.trim().toLowerCase();
  return province === "ab" || province === "alberta";
}
