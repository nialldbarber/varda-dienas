import { Fragment } from "react";
import type {
	GestureResponderEvent,
	PressableProps as NativePressableProps,
} from "react-native";
import { Pressable as NativePressable } from "react-native";
import Animated from "react-native-reanimated";

import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const hitSlop = { top: 20, right: 20, bottom: 20, left: 20 };

export interface PressableProps extends NativePressableProps {
	onPress?: null | ((event?: GestureResponderEvent) => void) | undefined;
	forceHaptic?: boolean;
	accessibilityLabel: string;
	animate?: boolean;
}

export function Pressable(props: PressableProps) {
	const {
		onPress,
		forceHaptic = false,
		accessibilityLabel,
		animate = false,
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

	return (
		<Container {...styles}>
			<NativePressable
				accessible
				role={props.role || "button"}
				disabled={props.disabled}
				onPress={handleOnPress}
				accessibilityLabel={accessibilityLabel}
				hitSlop={hitSlop}
				{...handlePressInOut}
				{...rest}
			>
				{children}
			</NativePressable>
		</Container>
	);
}
