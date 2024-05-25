import { Pressable } from "@/components/pressable";
import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import dati from "@/vardi.json";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import { CloseCircle } from "iconsax-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type VarduSaraksts =
	| {
			diena: string;
			vardi: string[];
			citiVardi: string[];
	  }
	| string;

const varduSaraksts = dati.varduSaraksts;

export default function Index() {
	const flashListRef = useRef<FlashList<VarduSaraksts>>(null);
	const [searchName, setSearchName] = useState("");
	const [filteredData, setFilteredData] =
		useState<VarduSaraksts[]>(varduSaraksts);

	const shouldShowCross = searchName.length > 0;

	useEffect(() => {
		const today = new Date();
		const currentDay = format(today, "dd");
		const currentMonth = format(today, "MM");

		console.log("effect running");

		let currentIndex = varduSaraksts.findIndex((item, index) => {
			if (typeof item === "string" && item === currentMonth) {
				return varduSaraksts
					.slice(index + 1)
					.some(
						(subItem) =>
							typeof subItem === "object" && subItem.diena === currentDay,
					);
			}
			return false;
		});

		if (currentIndex !== -1) {
			currentIndex +=
				varduSaraksts
					.slice(currentIndex + 1)
					.findIndex(
						(subItem) =>
							typeof subItem === "object" && subItem.diena === currentDay,
					) + 1;
		}

		if (flashListRef.current && currentIndex !== -1) {
			console.log("scrolling to index");
			flashListRef.current.scrollToIndex({ index: currentIndex });
		}
	}, []);

	const handleSearchVardi = useCallback((text: string) => {
		setSearchName(text);

		if (text.trim() === "") {
			setFilteredData(varduSaraksts);
		} else {
			const lowercasedFilter = text.toLowerCase();
			const filteredList: VarduSaraksts[] = [];
			let currentMonth: string | null = null;
			let monthHasMatch = false;

			for (const item of varduSaraksts) {
				if (typeof item === "string") {
					if (monthHasMatch) {
						monthHasMatch = false;
					}
					currentMonth = item;
				} else if (
					currentMonth &&
					(item.vardi.some((name) =>
						name.toLowerCase().includes(lowercasedFilter),
					) ||
						item.citiVardi.some((name) =>
							name.toLowerCase().includes(lowercasedFilter),
						))
				) {
					if (!monthHasMatch) {
						filteredList.push(currentMonth);
						monthHasMatch = true;
					}
					filteredList.push(item);
				}
			}

			setFilteredData(filteredList);
		}
	}, []);

	const handleClearSearchAndRepopluateData = () => {
		setSearchName("");
		setFilteredData(varduSaraksts);
	};

	const noNamesFound = filteredData.length === 0;

	const stickyHeaderIndices = varduSaraksts
		.map((item, index) => {
			if (typeof item === "string") {
				return index;
			}
			return null;
		})
		.filter((item) => item !== null) as number[];

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScreenHeader>Vārda Dienas</ScreenHeader>
			<View className="relative pb-3 h-[80px]">
				<TextInput
					value={searchName}
					className="bg-gray-200 rounded-xl p-4 mx-3 mt-5 mb-2"
					onChangeText={handleSearchVardi}
					placeholder="Meklēt vārdu"
					selectionColor="#A4343A"
				/>
				{shouldShowCross ? (
					<Pressable
						accessibilityLabel="Notīrīt meklēšanu"
						className="absolute right-5 top-[26px]"
						onPress={handleClearSearchAndRepopluateData}
					>
						<CloseCircle size="28" color="#A4343A" variant="Bold" />
					</Pressable>
				) : null}
			</View>
			{noNamesFound ? (
				<View className="pt-10 items-center justify-center">
					<Text withEmoji className="text-latvianRed text-xl" weight="bold">
						Vārds nav atrasts 🫣
					</Text>
				</View>
			) : (
				<FlashList
					ref={flashListRef}
					data={filteredData}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => {
						if (typeof item === "string") {
							return (
								<View className="bg-latvianRed">
									<Text className="p-4 text-2xl text-white" weight="extrabold">
										{item}
									</Text>
								</View>
							);
						}
						return (
							<View className="p-4">
								<Text
									className="text-latvianRed pb-2 text-xl"
									weight="extrabold"
								>
									{item?.diena}
								</Text>
								<View>
									<View className="flex flex-row flex-wrap">
										{item?.vardi.map((name, index) => {
											const lastIndex = index === item?.vardi.length - 1;
											return (
												<Text
													key={`vardi-${index}`}
													className="p-1"
													weight="bold"
												>
													{name}
													{lastIndex ? "" : ", "}
												</Text>
											);
										})}
									</View>
								</View>
								<View>
									<View className="flex flex-row flex-wrap">
										{item?.citiVardi.map((otherName, index) => {
											const lastIndex = index === item?.vardi.length - 1;
											return (
												<Text
													key={`citiVardi-${index}`}
													className="p-1"
													weight="medium"
												>
													{otherName}
													{lastIndex ? "" : ", "}
												</Text>
											);
										})}
									</View>
								</View>
							</View>
						);
					}}
					getItemType={(item) => {
						return typeof item === "string" ? "sectionHeader" : "row";
					}}
					stickyHeaderIndices={stickyHeaderIndices}
					estimatedItemSize={100}
				/>
			)}
		</SafeAreaView>
	);
}
