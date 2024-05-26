import { Fragment } from "react";
import type {
	GestureResponderEvent,
	PressableProps as NativePressableProps,
} from "react-native";
import { Pressable as NativePressable } from "react-native";
import Animated from "react-native-reanimated";

import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const hitSlopSmall = { top: 5, right: 5, bottom: 5, left: 5 };
const hitSlopMedium = { top: 15, right: 15, bottom: 15, left: 15 };
const hitSlopLarge = { top: 20, right: 20, bottom: 20, left: 20 };

export interface PressableProps extends Omit<NativePressableProps, "hitSlop"> {
	onPress?: null | ((event?: GestureResponderEvent) => void) | undefined;
	forceHaptic?: boolean;
	accessibilityLabel: string;
	animate?: boolean;
	hitSlop?: "small" | "medium" | "large";
}

export function Pressable(props: PressableProps) {
	const {
		onPress,
		forceHaptic = false,
		accessibilityLabel,
		animate = false,
		hitSlop = "small",
		children,
		...rest
	} = props;
	const { invokeHapticFeedback } = useHapticFeedback();
	const { style, onPressInOut } = useButtonAnimation("standard");

	function handleOnPress() {
		invokeHapticFeedback();

		if (onPress) {
			onPress();
		}
	}

	const handlePressInOut = {
		onPressIn: animate ? () => onPressInOut("in") : undefined,
		onPressOut: animate ? () => onPressInOut("out") : undefined,
	};

	const Container = animate ? Animated.View : Fragment;
	const styles = animate ? style : undefined;
	const hitSlopSize = {
		small: hitSlopSmall,
		medium: hitSlopMedium,
		large: hitSlopLarge,
	};

	return (
		<Container {...styles}>
			<NativePressable
				accessible
				role={props.role || "button"}
				disabled={props.disabled}
				onPress={handleOnPress}
				accessibilityLabel={accessibilityLabel}
				hitSlop={hitSlopSize[hitSlop]}
				{...handlePressInOut}
				{...rest}
			>
				{children}
			</NativePressable>
		</Container>
	);
}
