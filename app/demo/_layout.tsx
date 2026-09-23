import { DEMO_MODE_ENABLED } from '@/constants/demoFarmer';
import { Redirect, Stack } from 'expo-router';

export default function DemoLayout() {
    if (!DEMO_MODE_ENABLED) {
        return <Redirect href="/signin" />;
    }

    return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
