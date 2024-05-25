import * as Haptics from "expo-haptics";

import { store$ } from "@/store";

export function useHapticFeedback() {
	const hapticFeedback = store$.get().hapticFeedback;

	function invokeHapticFeedback() {
		if (hapticFeedback) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	}

	return { invokeHapticFeedback };
}
