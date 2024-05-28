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
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
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
export type Month = (typeof months)[number];
const monthMapping = {
	January: "Janvāris",
	February: "Februāris",
	March: "Marts",
	April: "Aprīlis",
	May: "Maijs",
	June: "Jūnijs",
	July: "Jūlijs",
	August: "Augusts",
	September: "Septembris",
	October: "Oktobris",
	November: "Novembris",
	December: "Decembris",
} as const;
type MonthMapping = typeof monthMapping;
const latvianMapping: { [key: string]: string[] } = {
	a: ["a", "ā"],
	c: ["c", "č"],
	e: ["e", "ē"],
	g: ["g", "ģ"],
	i: ["i", "ī"],
	k: ["k", "ķ"],
	l: ["l", "ļ"],
	n: ["n", "ņ"],
	s: ["s", "š"],
	u: ["u", "ū"],
	z: ["z", "ž"],
};

export default function Index() {
	const searchInputRef = useRef<TextInput>(null);
	const flashListRef = useRef<FlashList<VarduSaraksts>>(null);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [stickyIndices, setStickyIndices] = useState<(number | null)[]>([]);
	const monthIndices = useRef<{ [key in Month]?: number }>({});
	const [searchName, setSearchName] = useState("");
	const [highlightedName, setHighlightedName] = useState("");
	const [highlightedMonth, setHighlightedMonth] = useState<Month>("Janvāris");
	const [filteredData, setFilteredData] =
		useState<VarduSaraksts[]>(varduSaraksts);

	const shouldShowCross = searchName.length > 0;
	const noNamesFound = filteredData.length === 0;

	useEffect(() => {
		const today = new Date();
		const currentDay = format(today, "dd");
		const currentMonthEnglish = format(today, "MMMM");

		const currentMonth =
			monthMapping[currentMonthEnglish as keyof MonthMapping];

		for (const month of months) {
			monthIndices.current[month] = varduSaraksts.findIndex(
				(item) => item === month,
			);
		}

		const currentMonthIndex = varduSaraksts.findIndex(
			(item) => item === currentMonth,
		);

		if (currentMonthIndex !== -1) {
			const dayIndex = varduSaraksts
				.slice(currentMonthIndex + 1)
				.findIndex((item) => {
					return typeof item === "object" && item.diena === currentDay;
				});

			if (dayIndex !== -1 && flashListRef.current) {
				const targetIndex = currentMonthIndex + 1 + dayIndex;

				flashListRef.current.scrollToIndex({
					index: targetIndex,
					viewOffset: 0,
					animated: false,
				});

				setTimeout(() => {
					flashListRef?.current?.scrollToIndex({
						index: targetIndex,
						viewOffset: 0,
						animated: false,
					});
					setHighlightedMonth(currentMonth);
				}, 500);
			} else {
				console.error("Day index not found or flashListRef.current is null");
			}
		} else {
			console.error("Current month index not found");
		}
	}, []);

	useEffect(() => {
		const getStickyIndices = (number = 0) => {
			return filteredData
				.map((item, index) =>
					typeof item === "string" ? index + number : null,
				)
				.filter((index) => index !== null);
		};
		setStickyIndices(getStickyIndices(1));
		setTimeout(() => {
			setStickyIndices(getStickyIndices(0));
		}, 100);
	}, [filteredData.length]);

	const handleSearchVardi = useCallback((text: string) => {
		setSearchName(text);

		if (text.length > 2) {
			setHighlightedName(text);
			if (text.trim() === "") {
				setFilteredData(varduSaraksts);
			} else {
				const lowercasedFilter = text.toLowerCase();
				const filteredList: VarduSaraksts[] = [];
				let currentMonth: string | null = null;
				let monthHasMatch = false;

				const generatePossibleMatches = (text: string): string[] => {
					const possibleMatches: string[] = [""];

					for (const char of text) {
						const lowerChar = char.toLowerCase();
						if (latvianMapping[lowerChar]) {
							const newMatches: string[] = [];
							for (const match of possibleMatches) {
								for (const latvianChar of latvianMapping[lowerChar]) {
									newMatches.push(match + latvianChar);
								}
							}
							possibleMatches.splice(0, possibleMatches.length, ...newMatches);
						} else {
							for (let i = 0; i < possibleMatches.length; i++) {
								possibleMatches[i] += lowerChar;
							}
						}
					}
					return possibleMatches;
				};

				const possibleMatches = generatePossibleMatches(lowercasedFilter);

				for (const item of varduSaraksts) {
					if (typeof item === "string") {
						if (monthHasMatch) {
							monthHasMatch = false;
						}
						currentMonth = item;
					} else if (
						currentMonth &&
						(item.vardi.some((name) =>
							possibleMatches.some((match) =>
								name.toLowerCase().includes(match),
							),
						) ||
							item.citiVardi.some((name) =>
								possibleMatches.some((match) =>
									name.toLowerCase().includes(match),
								),
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
		}
	}, []);

	const handleClearSearchAndRepopulateData = () => {
		setSearchName("");
		setHighlightedName("");
		setFilteredData(varduSaraksts);
	};

	const loadingOpacity = useSharedValue(0);
	const zIndex = useSharedValue(0);
	const loadingOpacityStyles = useAnimatedStyle(() => ({
		opacity: loadingOpacity.value,
		zIndex: zIndex.value,
	}));

	const handleMonthPress = (month: Month) => {
		loadingOpacity.value = withTiming(1, { duration: 300 });
		zIndex.value = 1;

		setTimeout(() => {
			loadingOpacity.value = withTiming(0, { duration: 300 });
			zIndex.value = 0;
		}, 1000);

		setTimeout(() => {
			const index = monthIndices.current[month];
			if (index !== undefined && index !== -1 && flashListRef?.current) {
				flashListRef.current.scrollToIndex({
					index,
					animated: false,
				});

				setTimeout(() => {
					setHighlightedMonth(month);
					flashListRef?.current?.scrollToIndex({
						index,
						animated: false,
					});
				}, 200);
				setTimeout(() => {
					flashListRef?.current?.scrollToIndex({
						index,
						animated: false,
					});
				}, 300);
			}
		}, 300);
	};

	return (
		<SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
			<View className="mt-3">
				<ScreenHeader>Vārda Dienas</ScreenHeader>
			</View>
			<View className="relative pb-3 h-[80px] z-10">
				<TextInput
					ref={searchInputRef}
					value={searchName}
					className={`bg-gray-200 rounded-xl px-4 h-14 mx-3 mt-5 mb-2 border-2 font-cosmica-semibold text-latvianRed ${
						isSearchFocused ? "border-latvianRedFaded" : "border-transparent"
					}`}
					onChangeText={handleSearchVardi}
					onFocus={() => setIsSearchFocused(true)}
					onBlur={() => setIsSearchFocused(false)}
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
			<View className="flex-1 flex-grow min-h-1">
				<Animated.View
					className="absolute flex-1 bg-white w-full h-full bottom-[26px] items-center justify-center"
					style={loadingOpacityStyles}
				>
					<Text weight="bold" withEmoji className="text-latvianRed text-2xl">
						Vārdu atrašana... 🧐
					</Text>
				</Animated.View>

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
						contentContainerStyle={{
							paddingBottom: 50,
							backgroundColor: "#fff",
						}}
						getItemType={(item) => {
							return typeof item === "string" ? "sectionHeader" : "row";
						}}
						stickyHeaderIndices={stickyIndices}
						estimatedItemSize={83}
						renderItem={({ item, index }) => {
							if (typeof item === "string") {
								return (
									<View className="bg-latvianRed">
										<Text
											className="p-4 text-2xl text-white"
											weight="extrabold"
										>
											{item}
										</Text>
									</View>
								);
							}

							const currentMonth = filteredData
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
					/>
				)}
			</View>
			<BlurView
				intensity={80}
				className="absolute bottom-0 left-0 right-0 bg-white px-3 py-5 border-t border-gray-200 z-10"
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
