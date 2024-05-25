import * as Haptics from "expo-haptics";

import { state$ } from "@/store";

export function useHapticFeedback() {
	const hapticFeedback = state$.get().hapticFeedback;

	function invokeHapticFeedback() {
		if (hapticFeedback) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	}

	return { invokeHapticFeedback };
}
