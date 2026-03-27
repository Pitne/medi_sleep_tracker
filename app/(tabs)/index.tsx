import { Redirect } from 'expo-router';

// (tabs) is superseded by (app) — redirect to the real home
export default function TabsIndex() {
  return <Redirect href="/(app)" />;
}
