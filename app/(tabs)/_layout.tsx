import { Tabs } from "expo-router";
import { Home, Setting2, Star } from "iconsax-react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{ tabBarActiveTintColor: "#A4343A", headerShown: false }}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Mājas",
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
