import { Pressable } from "@/components/pressable";
import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import dati from "@/vardi.json";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import { Link } from "expo-router";
import { CloseCircle } from "iconsax-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LATVIAN_RED = "#A4343A";

export type VarduSaraksts =
	| {
			diena: string;
			vardi: string[];
			citiVardi: string[];
	  }
	| string;

const varduSaraksts = dati.varduSaraksts;
const months = [
	"Janvāris",
	"Februāris",
	"Marts",
	"Aprīlis",
	"Maijs",
	"Jūnijs",
	"Jūlijs",
	"Augusts",
	"Septembris",
	"Oktobris",
	"Novembris",
	"Decembris",
] as const;
type Month = (typeof months)[number];

export default function Index() {
	const flashListRef = useRef<FlashList<VarduSaraksts>>(null);
	const [searchName, setSearchName] = useState("");
	const [filteredData, setFilteredData] =
		useState<VarduSaraksts[]>(varduSaraksts);
	const [highlightedMonth, setHighlightedMonth] = useState("");

	const shouldShowCross = searchName.length > 0;

	useEffect(() => {
		const today = new Date();
		const currentDay = format(today, "dd");
		const currentMonth = format(today, "MM");

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

	const handleViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems }) => {
			const firstViewableItem = viewableItems[0];
			if (firstViewableItem && typeof firstViewableItem.item === "string") {
				setHighlightedMonth(firstViewableItem.item);
			}
		},
		[],
	);

	const handleMonthPress = (month: Month) => {
		const index = filteredData.findIndex((item) => item === month);

		if (index !== -1 && flashListRef.current) {
			flashListRef.current.scrollToIndex({ index });
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScreenHeader>Vārda Dienas</ScreenHeader>
			<View className="relative pb-3 h-[80px]">
				<TextInput
					value={searchName}
					className="bg-gray-200 rounded-xl p-4 mx-3 mt-5 mb-2"
					onChangeText={handleSearchVardi}
					placeholder="Meklēt vārdu"
					selectionColor={LATVIAN_RED}
				/>
				{shouldShowCross ? (
					<Pressable
						accessibilityLabel="Notīrīt meklēšanu"
						className="absolute right-5 top-[26px]"
						onPress={handleClearSearchAndRepopluateData}
					>
						<CloseCircle size="28" color={LATVIAN_RED} variant="Bold" />
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
							<Link
								href={{
									pathname: "/name",
									params: {
										vardi: item.vardi,
										citiVardi: item.citiVardi,
										diena: item.diena,
										...{ mēnesis: typeof item === "string" ? item : "" },
									},
								}}
							>
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
												const isNameSearchValue =
													name.toLowerCase() === searchName.toLowerCase();
												return (
													<View
														key={`vardi-${index}`}
														className={`rounded-md ${
															isNameSearchValue
																? "bg-latvianRed"
																: "bg-transparent"
														}`}
													>
														<Text
															className={`p-1 ${
																isNameSearchValue
																	? "text-white"
																	: "text-latvianRed"
															}`}
															weight="bold"
														>
															{name}
															{lastIndex ? "" : ", "}
														</Text>
													</View>
												);
											})}
										</View>
									</View>
									<View>
										<View className="flex flex-row flex-wrap">
											{item?.citiVardi.map((otherName, index) => {
												const lastIndex = index === item?.vardi.length - 1;
												const isNameSearchValue =
													otherName.toLowerCase() === searchName.toLowerCase();
												return (
													<View
														key={`citiVardi-${index}`}
														className={`rounded-md ${
															isNameSearchValue
																? "bg-latvianRed"
																: "bg-transparent"
														}`}
													>
														<Text
															className={`p-1 ${
																isNameSearchValue ? "text-white" : "text-black"
															}`}
															weight="medium"
														>
															{otherName}
															{lastIndex ? "" : ", "}
														</Text>
													</View>
												);
											})}
										</View>
									</View>
								</View>
							</Link>
						);
					}}
					getItemType={(item) => {
						return typeof item === "string" ? "sectionHeader" : "row";
					}}
					stickyHeaderIndices={stickyHeaderIndices}
					estimatedItemSize={100}
					onViewableItemsChanged={handleViewableItemsChanged}
				/>
			)}
			<View className="absolute bottom-0 left-0 right-0 bg-white p-2">
				<FlatList
					horizontal
					data={months}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => {
						const isActive = item === highlightedMonth;
						return (
							<Pressable
								onPress={() => handleMonthPress(item)}
								className="flex-1 items-center justify-center"
								accessibilityLabel="Mēnesis"
							>
								<Text
									className={`p-2 ${
										isActive ? "text-latvianRed" : "text-black"
									}`}
									weight="bold"
								>
									{item}
								</Text>
							</Pressable>
						);
					}}
					keyExtractor={(item) => item}
				/>
			</View>
		</SafeAreaView>
	);
}
