import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'meditate', title: 'Meditate', icon: 'leaf-outline', iconFocused: 'leaf' },
  { name: 'sleep', title: 'Sleep', icon: 'moon-outline', iconFocused: 'moon' },
  { name: 'journal', title: 'Journal', icon: 'book-outline', iconFocused: 'book' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', iconFocused: 'settings' },
];

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#9BA1A6',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0.5 },
      }}>
      {TABS.map(({ name, title, icon, iconFocused }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? iconFocused : icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
