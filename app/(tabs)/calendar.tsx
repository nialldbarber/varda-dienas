import { ScreenHeader } from "@/components/screen-header";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calendar() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 justify-center items-center">
          <ScreenHeader>Kalendārs</ScreenHeader>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
