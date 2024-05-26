import { NosaukumaRinda } from "@/components/nosaukuma-rinda";
import { Pressable } from "@/components/pressable";
import { ScreenHeader } from "@/components/screen-header";
import { Text } from "@/components/text";
import dati from "@/vardi.json";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import { CloseCircle } from "iconsax-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LATVIAN_RED = "#A4343A";
const SCROLL_OFFSET = 120;

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
export type Month = (typeof months)[number];

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
				viewOffset: SCROLL_OFFSET,
			});
		}
	}, []);

	const handleSearchVardi = (text: string) => {
		setSearchName(text);
		setHighlightedName(text);

		if (text.trim() !== "") {
			const lowercasedFilter = text.toLowerCase();

			const exactMatchIndex = varduSaraksts.findIndex((item) => {
				if (typeof item === "object") {
					return (
						item.vardi.some(
							(name) => name.toLowerCase() === lowercasedFilter,
						) ||
						item.citiVardi.some(
							(name) => name.toLowerCase() === lowercasedFilter,
						)
					);
				}
				return false;
			});

			if (exactMatchIndex !== -1 && flashListRef.current) {
				flashListRef.current.scrollToIndex({
					index: exactMatchIndex,
					viewPosition: 0,
					viewOffset: SCROLL_OFFSET,
				});
			}
		} else {
			setHighlightedName("");
		}
	};

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
		({ viewableItems }: { viewableItems: any }) => {
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
			flashListRef.current.scrollToIndex({
				index,
				viewOffset: SCROLL_OFFSET,
			});
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="mt-3">
				<ScreenHeader>Vārda Dienas</ScreenHeader>
			</View>
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
				contentContainerStyle={{ paddingBottom: 50 }}
				renderItem={({ item, index }) => {
					if (typeof item === "string") {
						return (
							<View className="bg-latvianRed">
								<Text className="p-4 text-2xl text-white" weight="extrabold">
									{item}
								</Text>
							</View>
						);
					}

					const currentMonth = varduSaraksts
						.slice(0, index)
						.reverse()
						.find((i) => typeof i === "string") as string;

					return (
						<Link
							href={{
								pathname: "/name",
								params: {
									vardi: item.vardi,
									citiVardi: item.citiVardi,
									diena: item.diena,
									mēnesis: currentMonth,
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
								<NosaukumaRinda
									vardaVeids="vardi"
									item={item}
									highlightedName={highlightedName}
									searchName={searchName}
								/>
								<NosaukumaRinda
									vardaVeids="citiVardi"
									item={item}
									highlightedName={highlightedName}
									searchName={searchName}
								/>
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
			<BlurView
				intensity={80}
				className="absolute bottom-0 left-0 right-0 bg-white px-3 py-5 border-t border-gray-200"
			>
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
									className={`py-1 px-4 ${
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
			</BlurView>
		</SafeAreaView>
	);
}
