import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		"Cosmica-Bold": require("../assets/fonts/Cosmica-Bold.ttf"),
		"Cosmica-Extrabold": require("../assets/fonts/Cosmica-Extrabold.ttf"),
		"Cosmica-Heavy": require("../assets/fonts/Cosmica-Heavy.ttf"),
		"Cosmica-Light": require("../assets/fonts/Cosmica-Light.ttf"),
		"Cosmica-Medium": require("../assets/fonts/Cosmica-Medium.ttf"),
		"Cosmica-Regular": require("../assets/fonts/Cosmica-Regular.ttf"),
		"Cosmica-Semibold": require("../assets/fonts/Cosmica-Semibold.ttf"),
	});

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="name"
				options={{ headerShown: false, presentation: "modal" }}
			/>
		</Stack>
	);
}
