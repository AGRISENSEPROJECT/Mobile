import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ITEMS = [
    { label: 'Home', icon: 'home-outline' as const, activeIcon: 'home' as const, route: '/demo/dashboard' },
    { label: 'History', icon: 'time-outline' as const, activeIcon: 'time' as const, route: '/demo/recommendations' },
    { label: 'Profile', icon: 'person-outline' as const, activeIcon: 'person' as const, route: '/demo/profile' },
];

export default function DemoBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <View style={styles.container} accessibilityRole="tablist">
            {ITEMS.map((item) => {
                const active = pathname.startsWith(item.route);
                return (
                    <TouchableOpacity
                        key={item.route}
                        style={styles.item}
                        onPress={() => router.replace(item.route as never)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={item.label}
                    >
                        <Ionicons
                            name={active ? item.activeIcon : item.icon}
                            size={22}
                            color={active ? '#0B4D26' : '#7B877E'}
                        />
                        <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E4E9DF',
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 14,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    label: {
        color: '#7B877E',
        fontSize: 11,
        fontWeight: '600',
    },
    activeLabel: {
        color: '#0B4D26',
        fontWeight: '800',
    },
});

