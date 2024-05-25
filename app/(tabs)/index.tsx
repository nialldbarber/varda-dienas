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
	const searchInputRef = useRef<TextInput>(null);
	const flashListRef = useRef<FlashList<VarduSaraksts>>(null);
	const [searchName, setSearchName] = useState("");
	const [highlightedName, setHighlightedName] = useState("");
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
			flashListRef.current.scrollToIndex({
				index: currentIndex,
				viewOffset: 120,
			});
		}
	}, []);

	const handleSearchVardi = useCallback((text: string) => {
		setSearchName(text);
		setHighlightedName(text);

		if (text.trim() !== "") {
			const lowercasedFilter = text.toLowerCase();
			let exactMatchIndex = -1;

			for (let i = 0; i < varduSaraksts.length; i++) {
				const item = varduSaraksts[i];
				if (typeof item === "object") {
					if (
						item.vardi.some(
							(name) => name.toLowerCase() === lowercasedFilter,
						) ||
						item.citiVardi.some(
							(name) => name.toLowerCase() === lowercasedFilter,
						)
					) {
						exactMatchIndex = i;
						break;
					}
				}
			}

			if (exactMatchIndex !== -1 && flashListRef.current) {
				flashListRef.current.scrollToIndex({
					index: exactMatchIndex,
					viewPosition: 0,
					viewOffset: 120, // Add top padding here
				});
			}
		} else {
			setHighlightedName("");
		}
	}, []);

	const handleClearSearchAndRepopulateData = () => {
		setSearchName("");
		setHighlightedName("");
	};

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
		const index = varduSaraksts.findIndex((item) => item === month);

		if (index !== -1 && flashListRef.current) {
			flashListRef.current.scrollToIndex({ index, viewOffset: 120 });
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScreenHeader>Vārda Dienas</ScreenHeader>
			<View className="relative pb-3 h-[80px]">
				<TextInput
					ref={searchInputRef}
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
						onPress={handleClearSearchAndRepopulateData}
					>
						<CloseCircle size="28" color={LATVIAN_RED} variant="Bold" />
					</Pressable>
				) : null}
			</View>
			<FlashList
				ref={flashListRef}
				data={varduSaraksts}
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
												name.toLowerCase() === highlightedName.toLowerCase();
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
											const lastIndex = index === item?.citiVardi.length - 1;
											const isNameSearchValue =
												otherName.toLowerCase() ===
												highlightedName.toLowerCase();
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
