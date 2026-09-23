import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function DemoBadge() {
    return (
        <View style={styles.badge} accessibilityLabel="Demonstration account">
            <Ionicons name="sparkles" size={12} color="#7A4A00" />
            <Text style={styles.text}>DEMO ACCOUNT</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#FFF3CF',
        borderColor: '#F2D68A',
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    text: {
        color: '#7A4A00',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});

