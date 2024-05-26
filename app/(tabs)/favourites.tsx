import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import { store$ } from "@/store";
import { useSelector } from "@legendapp/state/react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Favourites() {
	const listOfNames = useSelector(store$.vardsUnVardaDiena);

	return (
		<SafeAreaView>
			<ScrollView>
				<View className="flex-1 justify-center items-center">
					<ScreenHeader>Izvēlētie</ScreenHeader>
					{listOfNames.map((names) => (
						<View key={names.vards}>
							<Text>{names.vards}</Text>
						</View>
					))}
					<View></View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
