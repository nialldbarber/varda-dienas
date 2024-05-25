import { observable, when } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureObservableSync, syncObservable } from "@legendapp/state/sync";
import AsyncStorage from "@react-native-async-storage/async-storage";

enableReactComponents();
enableReactTracking({ auto: true });

type State = {
	hapticFeedback: boolean;
};
type Actions = {
	setHapticFeedback: (hapticFeedback: boolean) => void;
};
interface Store extends State, Actions {}

export const store$ = observable<Store>({
	hapticFeedback: true,
	setHapticFeedback: (hapticFeedback: boolean) => {
		store$.assign({ hapticFeedback });
	},
});

const status$ = syncObservable(store$, {
	persist: {
		name: "store",
	},
});
await when(status$.isPersistLoaded);

configureObservableSync({
	persist: {
		plugin: ObservablePersistAsyncStorage,
		asyncStorage: { AsyncStorage },
	},
});
