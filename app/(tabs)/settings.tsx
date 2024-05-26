import { LATVIAN_RED } from "@/app/(tabs)";
import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import { store$ } from "@/store";
import { useSelector } from "@legendapp/state/react";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
	const hapticFeedback = useSelector(store$.hapticFeedback);

	return (
		<SafeAreaView>
			<ScrollView>
				<View className="flex-1">
					<View className="justify-center items-center">
						<ScreenHeader>Iestatījumi</ScreenHeader>
					</View>
					<View className="p-3">
						<Text className="">Haptics</Text>
						<Text>{JSON.stringify(hapticFeedback)}</Text>
						<Text>Pārslēgt haptics</Text>
						<Switch
							accessibilityLabel="Pārslēgt haptics"
							value={hapticFeedback}
							onValueChange={(value) =>
								store$.setHapticFeedback(!hapticFeedback)
							}
							trackColor={{ false: "#767577", true: LATVIAN_RED }}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
