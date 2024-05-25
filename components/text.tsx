import React, { useMemo } from "react";
import type { TextProps as NativeTextProps } from "react-native";
import { Text as NativeText } from "react-native";

import { renderStringWithEmoji } from "@/utils/renderStringWithEmoji";

const weights = {
  bold: "font-cosmica-bold",
  extrabold: "font-cosmica-extrabold",
  heavy: "font-cosmica-heavy",
  light: "font-cosmica-light",
  medium: "font-cosmica-medium",
  regular: "font-cosmica-regular",
  semibold: "font-cosmica-semibold",
};

export type BaseTextProps = {
  weight?:
    | "bold"
    | "extrabold"
    | "heavy"
    | "light"
    | "medium"
    | "regular"
    | "semibold";
  className?: string;
  withEmoji?: boolean;
  a11yHint?: string;
  isError?: boolean;
};

export interface TextProps extends NativeTextProps, BaseTextProps {}

export function Text({
  withEmoji = false,
  a11yHint,
  weight = "semibold",
  isError = false,
  className,
  children,
}: TextProps) {
  const renderChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (typeof child === "string") {
        return withEmoji ? renderStringWithEmoji(child) : child;
      }
      if (React.isValidElement(child)) {
        const childWithStyle = child as React.ReactElement<{
          style?: React.CSSProperties;
        }>;
        return React.cloneElement(childWithStyle, {
          style: {
            ...childWithStyle.props.style,
            alignSelf: "baseline",
          },
        });
      }
      return child;
    });
  }, [children, withEmoji]);

  const getFontWeight = weights[weight] || weights.semibold;

  return (
    <NativeText
      className={`${getFontWeight} ${className}`}
      maxFontSizeMultiplier={1.5}
      accessibilityHint={a11yHint}
    >
      {renderChildren}
    </NativeText>
  );
}
