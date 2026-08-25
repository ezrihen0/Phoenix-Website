import type { DetailedHTMLProps, HTMLAttributes } from "react";

type GoogleMapsElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-map": GoogleMapsElementProps & {
        center?: string;
        zoom?: string | number;
        "map-id"?: string;
      };
      "gmp-advanced-marker": GoogleMapsElementProps;
      "gmpx-place-picker": GoogleMapsElementProps & {
        country?: string;
        type?: string;
        placeholder?: string;
        "for-map"?: string;
        "location-bias"?: string;
        radius?: string | number;
      };
    }
  }
}

export {};
