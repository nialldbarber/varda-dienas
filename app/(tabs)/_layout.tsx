import { Tabs } from "expo-router";
import { Calendar, Home, Setting2, Star } from "iconsax-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#A4343A", headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home size="30" variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Calendar size="30" variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color }) => (
            <Star size="30" variant="Bold" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Setting2 size="30" variant="Bold" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
