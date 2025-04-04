import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider } from "../context/userContext.js";
import * as Notifications from "expo-notifications";
// import { registerForPushNotificationsAsync } from "../utils/notificationService.js"

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const notificationListener = useRef<Notifications.Subscription | null>(null);
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	// useEffect(() => {
	// 	registerForPushNotificationsAsync().then((token) => {
	// 		if (token) {
	// 			console.log("Expo Push Token:", token);
	// 			setPushToken(token)
	// 		}
	// 	});

	// 	notificationListener.current = Notifications.addNotificationReceivedListener(
	// 		(notification) => {
	// 			console.log("Notification Received:", notification);
	// 		}
	// 	);

	// 	return () => {
	// 		if (notificationListener.current) {
	// 			Notifications.removeNotificationSubscription(notificationListener.current);
	// 		}
	// 	};

	// }, []);

	if (!loaded) {
		return null;
	}

	return (
		<UserProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Roles/Student" options={{ headerShown: false }} />
					<Stack.Screen name="Admin/login" options={{ headerShown: false }} />
					<Stack.Screen name="userloginsign/login" options={{ headerShown: false }} />
					<Stack.Screen name="userloginsign/Signup" options={{ headerShown: false }} />
					<Stack.Screen name="HomePage/Home" options={{ headerShown: false }} />
					<Stack.Screen name="HomePage/AdminHome" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Profile/Profile" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Admin profile/Profile" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Profile/ViewProfile" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Profile/EditProfile" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Profile/AppliedCompanies" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Profile/ChangePassword" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Admin profile/ChangePassword" options={{ headerShown: false }} />
					<Stack.Screen name="screens/PastYearCompanies" options={{ headerShown: false }} />
					<Stack.Screen name="screens/CurrentYearPlacement" options={{ headerShown: false }} />
					<Stack.Screen name="screens/ConnectIWithAlumni" options={{ headerShown: false }} />
					<Stack.Screen name="screens/QuestionAskByCompanies" options={{ headerShown: false }} />
					<Stack.Screen name="screens/InterviewPrep" options={{ headerShown: false }} />
					<Stack.Screen name="screens/FundamentalSubject" options={{ headerShown: false }} />
					<Stack.Screen name="screens/hrQuestions" options={{ headerShown: false }} />
					<Stack.Screen name="screens/UpcomingCompanies" options={{ headerShown: false }} />
					<Stack.Screen name="screens/BranchWisePlacement" options={{ headerShown: false }} />
					<Stack.Screen name="screens/StudentPlacements" options={{ headerShown: false }} />
					<Stack.Screen name="screens/PlacementPolicies" options={{ headerShown: false }} />
					<Stack.Screen name="screens/UploadResume" options={{ headerShown: false }} />
					<Stack.Screen name="screens/ChatBot" options={{ headerShown: false }} />
					<Stack.Screen name="company/google" options={{ headerShown: false }} />
					<Stack.Screen name="company/microsoft" options={{ headerShown: false }} />
					<Stack.Screen name="company/amazon" options={{ headerShown: false }} />
					<Stack.Screen name="company/meta" options={{ headerShown: false }} />
					<Stack.Screen name="company/apple" options={{ headerShown: false }} />
					<Stack.Screen name="company/flipkart" options={{ headerShown: false }} />
					<Stack.Screen name="company/gameskraft" options={{ headerShown: false }} />
					<Stack.Screen name="company/morgan-stanley" options={{ headerShown: false }} />
					<Stack.Screen name="company/tech-mahindra" options={{ headerShown: false }} />
					<Stack.Screen name="company/uber" options={{ headerShown: false }} />
					<Stack.Screen name="company/netflix" options={{ headerShown: false }} />
					<Stack.Screen name="company/nvidia" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Admin/DownloadPlacementData" options={{ headerShown: false }} />
					<Stack.Screen name="screens/Admin/DownloadStudentData" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</UserProvider>
	);
}