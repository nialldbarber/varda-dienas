import { LATVIAN_RED } from "@/app/(tabs)";
import { Pressable } from "@/components/pressable";
import { Text } from "@/components/text";
import type { VardaDiena } from "@/store";
import { store$ } from "@/store";
import { useSelector } from "@legendapp/state/react";
import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export function SelectRow({ vards, diena, menesis }: Partial<VardaDiena>) {
	const { navigate } = useNavigation();
	const listOfNames = useSelector(store$.vardsUnVardaDiena);
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		const isSelected = listOfNames.some(
			(entry) => entry.vards === vards && entry.shouldNotify,
		);
		setIsSelected(isSelected);
	}, [listOfNames, vards]);

	const handleAddNameForNotification = () => {
		if (!vards || !diena || !menesis) return;

		if (isSelected) {
			store$.removeVardsUnVardaDiena(vards);
		} else {
			Toast.show({
				type: "success",
				text1: "Wooo!",
				text2: `Vārds ${vards} pievienots pie paziņojumiem`,
				position: "bottom",
				visibilityTime: 6000,
				// @ts-ignore
				onPress: () => navigate("favourites"),
			});

			store$.addVardsUnVardaDiena({
				vards,
				diena,
				menesis,
				shouldNotify: true,
			});
		}
		setIsSelected(!isSelected);
	};

	return (
		<Pressable
			onPress={handleAddNameForNotification}
			accessibilityLabel="Izvēlieties vārdu paziņojumam"
		>
			<View className="flex-row items-center justify-between py-3 border-t-[1px] border-gray-300">
				<Text>{vards}</Text>
				<Checkbox
					value={isSelected}
					color={isSelected ? LATVIAN_RED : undefined}
					onValueChange={handleAddNameForNotification}
				/>
			</View>
		</Pressable>
	);
}
