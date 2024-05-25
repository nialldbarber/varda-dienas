import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { Text } from "@/components/text";

export function ScreenHeader({ children }: PropsWithChildren) {
	return (
		<View>
			<Text
				className="text-center text-3xl text-latvianRed mt-3"
				weight="extrabold"
				withEmoji
			>
				{children}
			</Text>
		</View>
	);
}
