import { Text } from "@/components/text";
import { View } from "react-native";

type Props = {
	vardaVeids: "vardi" | "citiVardi";
	item: {
		vardi: string[];
		citiVardi: string[];
	};
	searchName: string;
	highlightedName: string;
};

export function NosaukumaRinda({
	vardaVeids,
	item,
	searchName,
	highlightedName,
}: Props) {
	return (
		<View className="flex flex-row flex-wrap">
			{item?.[vardaVeids].map((name, index) => {
				const lastIndex = index === item?.[vardaVeids].length - 1;

				const isNameSearchValue = () => {
					if (searchName.length === 0) return false;
					return name.toLowerCase() === highlightedName.toLowerCase();
				};

				return (
					<View
						key={`${vardaVeids}-${index}`}
						className={`rounded-md ${
							isNameSearchValue() ? "bg-latvianRed" : "bg-transparent"
						}`}
					>
						<Text
							className={`p-1 ${
								isNameSearchValue()
									? "text-white"
									: vardaVeids === "vardi"
										? "text-latvianRed"
										: "text-gray-700"
							}`}
							weight={item.vardi ? "bold" : "medium"}
						>
							{name}
							{lastIndex ? "" : ", "}
						</Text>
					</View>
				);
			})}
		</View>
	);
}
