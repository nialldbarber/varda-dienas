import notifee, {
	AuthorizationStatus,
	TriggerType,
	type TimestampTrigger,
} from "@notifee/react-native";

/**
 * Request the users permission to show notifications
 */
export async function checkNotificationPermissions() {
	const settings = await notifee.requestPermission();

	if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		return true;
	}

	return false;
}

/**
 * Schedule a notification for the users birthday
 * 3 days before and on the day
 */
export async function scheduleVardaDienaNotifications(
	name: string,
	vardaDienasDatums: Date,
) {
	const threeDaysBefore = new Date(vardaDienasDatums);
	threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

	const triggerThreeDaysBefore: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: threeDaysBefore.getTime(),
	};

	await notifee.createTriggerNotification(
		{
			title: "Vārda diena tuvojas!",
			body: `Pēc 3 dienām būs ${name} vārda diena!`,
			android: {
				channelId: "varda-diena",
			},
		},
		triggerThreeDaysBefore,
	);

	const triggerOnDay: TimestampTrigger = {
		type: TriggerType.TIMESTAMP,
		timestamp: vardaDienasDatums.getTime(),
	};

	await notifee.createTriggerNotification(
		{
			title: "Vārda diena!",
			body: `Šodien ir ${name} vārda diena!`,
			android: {
				channelId: "varda-diena",
			},
		},
		triggerOnDay,
	);
}
