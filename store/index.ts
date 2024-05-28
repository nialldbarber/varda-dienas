import type { Month } from "@/app/(tabs)";
import { observable } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { configureObservableSync, syncObservable } from "@legendapp/state/sync";

enableReactComponents();
enableReactTracking({ auto: true });

export type VardaDiena = {
	vards: string;
	diena?: string;
	menesis: Month;
	shouldNotify: boolean;
};

type State = {
	hapticFeedback: boolean;
	vardsUnVardaDiena: VardaDiena[];
};
type Actions = {
	setHapticFeedback: (hapticFeedback: boolean) => void;
	addVardsUnVardaDiena: (vardsUnVardaDiena: VardaDiena) => void;
	removeVardsUnVardaDiena: (vards: string) => void;
};
interface Store extends State, Actions {}

export const store$ = observable<Store>({
	hapticFeedback: true,
	vardsUnVardaDiena: [],
	setHapticFeedback: (hapticFeedback: boolean) => {
		store$.assign({ hapticFeedback });
	},
	addVardsUnVardaDiena: (vardsUnVardaDiena: VardaDiena) => {
		store$.assign({
			vardsUnVardaDiena: [...store$.get().vardsUnVardaDiena, vardsUnVardaDiena],
		});
	},
	removeVardsUnVardaDiena: (vards: string) => {
		store$.assign({
			vardsUnVardaDiena: store$
				.get()
				.vardsUnVardaDiena.filter((v) => v.vards !== vards),
		});
	},
});

configureObservableSync({
	persist: {
		plugin: ObservablePersistMMKV,
	},
});

syncObservable(store$, {
	persist: {
		name: "store",
	},
});
