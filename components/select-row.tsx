import { LATVIAN_RED } from "@/app/(tabs)";
import { Pressable } from "@/components/pressable";
import { Text } from "@/components/text";
import type { VardaDiena } from "@/store";
import { store$ } from "@/store";
import { useSelector } from "@legendapp/state/react";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { View } from "react-native";

export function SelectRow({ vards, diena, menesis }: Partial<VardaDiena>) {
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
			accessibilityLabel="Select name for notification"
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
