import type { Month } from "@/app/(tabs)";
import { LATVIAN_RED } from "@/app/(tabs)";
import { ScreenHeader } from "@/components/screen-header";
import { SelectRow } from "@/components/select-row";
import { Text } from "@/components/text";
import { Link, useLocalSearchParams } from "expo-router";
import { CloseCircle } from "iconsax-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const formatVardi = (vardi?: string) => vardi?.split(",") ?? [];

export default function Name() {
	const local = useLocalSearchParams<{
		diena?: string;
		vardi?: string;
		citiVardi?: string;
		mēnesis: Month;
	}>();
	const vardi = formatVardi(local?.vardi);
	const citiVardi = formatVardi(local?.citiVardi);

	return (
		<>
			<SafeAreaView>
				<ScrollView>
					<View className="flex flex-row justify-between items-center px-5">
						<ScreenHeader>
							{local.diena} {local.mēnesis}
						</ScreenHeader>
						<Link href="/">
							<CloseCircle size="28" color={LATVIAN_RED} variant="Bold" />
						</Link>
					</View>
					<View>
						<View className="flex-1 m-3 bg-gray-200 rounded-lg p-4">
							<Text weight="extrabold" className="text-xl pb-2">
								Vārdi:
							</Text>
							{vardi.map((vards) => (
								<SelectRow
									key={vards}
									vards={vards}
									diena={local.diena}
									menesis={local.mēnesis}
								/>
							))}
						</View>
						<View className="flex-1 m-3 bg-gray-200 rounded-lg p-4">
							<View>
								<Text weight="extrabold" className="text-xl pb-2">
									Citi vārdi:
								</Text>
								{citiVardi.map((vards) => (
									<SelectRow
										key={vards}
										vards={vards}
										diena={local.diena}
										menesis={local.mēnesis}
									/>
								))}
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
			<Toast />
		</>
	);
}
