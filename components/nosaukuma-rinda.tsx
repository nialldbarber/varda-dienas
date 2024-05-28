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
		<View>
			<View style={{ flexDirection: "row" }}>
				{item?.[vardaVeids].map((name, index) => {
					const lastIndex = index === item?.[vardaVeids].length - 1;

					const isNameSearchValue = () => {
						if (searchName.length <= 2) return false;
						return name.toLowerCase().includes(highlightedName.toLowerCase());
					};

					return (
						<View
							key={`${vardaVeids}-${index}`}
							className={`rounded-md ${
								isNameSearchValue()
									? "bg-latvianRedFaded border-2 border-latvianRed"
									: "bg-transparent"
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
								weight={vardaVeids === "vardi" ? "bold" : "medium"}
							>
								{name}
								{lastIndex ? "" : ", "}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}
