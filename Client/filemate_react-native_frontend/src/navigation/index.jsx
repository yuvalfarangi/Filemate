import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import Compress from '../screens/Compress';
import Download from '../screens/Download';
import Home from '../screens/Home';
import History from '../screens/History';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function Tabs({ setIsUserLogin }) {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    marginHorizontal: 15,
                    borderRadius: 25,
                    height: 65,
                    backgroundColor: 'white',
                    paddingTop: 10,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    opacity: 0.8,
                },
                tabBarShowLabel: false, // Hide tab labels
                tabBarActiveTintColor: '#007bff', // Color for selected icon
                tabBarInactiveTintColor: '#666', // Color for unselected icons
            }}
        >
            <Tab.Screen
                name="Compress"
                component={Compress}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../../assets/icons/compressed.png')} style={{ width: 23, height: 23, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Download"
                component={Download}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../../assets/icons/downloads.png')} style={{ width: 23, height: 23, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../../assets/icons/home.png')} style={{ width: 23, height: 23, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={History}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../../assets/icons/history.png')} style={{ width: 23, height: 23, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={() => <Profile setIsUserLogin={setIsUserLogin} />}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require('../../assets/icons/user.png')} style={{ width: 23, height: 23, tintColor: color }} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}