import { Fragment } from "react";
import type {
	GestureResponderEvent,
	PressableProps as NativePressableProps,
} from "react-native";
import { Pressable as NativePressable } from "react-native";
import Animated from "react-native-reanimated";

import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export interface PressableProps extends NativePressableProps {
	/**
	 * Function to be called when the Pressable
	 * is pressed added optionally here from
	 * `PressableProps`, to make the parameters
	 * optional if we want to just trigger
	 * a haptic and no onPress event
	 */
	onPress?: null | ((event?: GestureResponderEvent) => void) | undefined;
	/**
	 * Use this when the Pressable doesn't
	 * fire a function, but still requires
	 * feedback
	 */
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
				{...handlePressInOut}
				{...rest}
			>
				{children}
			</NativePressable>
		</Container>
	);
}
