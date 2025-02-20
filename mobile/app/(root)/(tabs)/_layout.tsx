import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
  styles,
  iconStyles,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
  styles?: string;
  iconStyles?: string;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-neutral-200" : ""
    } ${styles}`}
  >
    <View
      className={`rounded-full w-[30px] h-[30px] items-center justify-center ${
        focused ? "bg-transparent" : ""
      }`}
    >
      <Image
        source={icon}
        tintColor={focused ? "black" : "white"}
        resizeMode="contain"
        className={`${focused ? "w-6 h-6 ml-3" : "w-7 h-7"} ${iconStyles}`}
      />
    </View>
    {focused && (
      <Text className={`text-black text-xs font-medium p-2`}>{title}</Text>
    )}
  </View>
);

const TabsLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0A5EFE",
            position: "absolute",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.home}
                title="Home"
                styles="ml-4"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.map} title="Map" />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.calendar}
                iconStyles="w-6 h-6"
                title="Events"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Leaderboard",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.leaderboard}
                iconStyles="w-6 h-6 ml-4"
                title="Ranking"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.person}
                title="Profile"
                iconStyles={`${focused ? "w-5 h-5" : "w-6 h-6"}`}
                styles="mr-2"
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default TabsLayout;
