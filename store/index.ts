import { observable } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureObservableSync } from "@legendapp/state/sync";

enableReactComponents();

type State = {
	hapticFeedback: boolean;
};

type Actions = {
	setHapticFeedback: (hapticFeedback: boolean) => void;
};

interface Store extends State, Actions {}

export const state$ = observable<Store>({
	hapticFeedback: true,
	setHapticFeedback: (hapticFeedback: boolean) => {
		state$.assign({ hapticFeedback });
	},
});

configureObservableSync({
	persist: {
		plugin: ObservablePersistAsyncStorage,
		retrySync: true,
	},
	retry: {
		infinite: true,
	},
});
