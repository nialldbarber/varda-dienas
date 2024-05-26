import { LATVIAN_RED } from "@/app/(tabs)";
import { Tabs } from "expo-router";
import { Home, Setting2, Star } from "iconsax-react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: LATVIAN_RED,
				headerShown: false,
				tabBarLabelStyle: { fontFamily: "Cosmica-Bold" },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Vārdi",
					tabBarIcon: ({ color }) => (
						<Home size="30" variant="Bold" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="favourites"
				options={{
					title: "Izvēlētie",
					tabBarIcon: ({ color }) => (
						<Star size="30" variant="Bold" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Iestatījumi",
					tabBarIcon: ({ color }) => (
						<Setting2 size="30" variant="Bold" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
