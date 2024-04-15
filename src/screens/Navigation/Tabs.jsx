import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../HomeStack/HomeScreen";
import MessageScreen from "../MessageStack/MessageScreen";
import SearchScreen from "../SearchStack/SearchScreen";
import TransactionScreen from "../TransactionStack/TransactionScreen";
import SettingScreen from "../SettingStack/SettingScreen";

import TraderProfile from "../HomeStack/TraderProfile";

import { Icon } from "@rneui/base";

import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const isFarmer = useSelector((state) => state.ui.isFarmer);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            } else if (route.name === "TraderHome") {
              iconName = focused ? "storefront" : "storefront-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            } else if (route.name === "Transaction") {
              iconName = focused ? "cash" : "cash-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            } else if (route.name === "Message") {
              iconName = focused
                ? "chatbox-ellipses"
                : "chatbox-ellipses-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            } else if (route.name === "Setting") {
              iconName = focused ? "settings" : "settings-outline";
              color = focused ? "#60BB46" : "#b5b3b3";
            }

            // You can return any component that you like here!
            return (
              <Icon name={iconName} type="ionicon" size={32} color={color} />
            );
          },

          tabBarShowLabel: false,
          tabBarStyle: {
            elevation: 0,

            backgroundColor: "#ffffff",
            height: 90,

            position: "absolute",
            paddingHorizontal: 15,
          },
          tabBarHideOnKeyboard: true,
        })}
      >
        {isFarmer ? (
          <Tab.Screen
            options={{
              headerShown: false,
            }}
            name="Home"
            component={HomeScreen}
          />
        ) : (
          <Tab.Screen
            options={{
              headerShown: false,
            }}
            name="TraderHome"
            component={TraderProfile}
          />
        )}

        <Tab.Screen
          name="Transaction"
          component={TransactionScreen}
          options={{
            headerShown: false,
          }}
        />
        {isFarmer && (
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              headerShown: false,
            }}
          />
        )}

        <Tab.Screen
          name="Message"
          component={MessageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          options={{
            headerShown: false,
          }}
          name="Setting"
          component={SettingScreen}
        />
      </Tab.Navigator>
    </>
  );
}
