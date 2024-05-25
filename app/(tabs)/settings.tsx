import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import { state$ } from "@/store";
import { useSelector } from "@legendapp/state/react";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
	const hapticFeedback = useSelector(state$.hapticFeedback);

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
							onValueChange={() => state$.hapticFeedback.set(!hapticFeedback)}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
