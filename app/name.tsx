import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Name() {
	const local = useLocalSearchParams<{
		diena?: string;
		vardi?: string;
		citiVardi?: string;
	}>();

	const vardi = local?.vardi?.split(",") ?? [];
	const citiVardi = local?.citiVardi?.split(",") ?? [];

	return (
		<SafeAreaView>
			<ScrollView>
				<View className="flex-1 m-3">
					<ScreenHeader>{local.diena}</ScreenHeader>
					<View>
						<Text weight="extrabold" className="text-xl">
							Vārdi:
						</Text>
						{vardi.map((vards) => (
							<Text key={vards}>{vards}</Text>
						))}
					</View>
					<View>
						<Text weight="extrabold" className="text-xl">
							Citi vārdi:
						</Text>
						{citiVardi.map((vards) => (
							<Text key={vards}>{vards}</Text>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
