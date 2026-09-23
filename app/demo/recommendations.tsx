import DemoBadge from '@/components/demo/DemoBadge';
import DemoBottomNav from '@/components/demo/DemoBottomNav';
import { DEMO_FARM, DEMO_RECOMMENDATIONS } from '@/constants/demoFarmer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DemoRecommendations() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <DemoBadge />
                    <Text style={styles.title}>Recommendation history</Text>
                    <Text style={styles.subtitle}>{DEMO_FARM.name} · {DEMO_RECOMMENDATIONS.length} completed analyses</Text>
                </View>
                <View style={styles.historyIcon}>
                    <Ionicons name="time" size={25} color="#0B4D26" />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.insightBanner}>
                    <Ionicons name="trending-up" size={22} color="#24673E" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.insightTitle}>Soil health is improving</Text>
                        <Text style={styles.insightText}>Moisture and nutrient balance improved across the last three scans.</Text>
                    </View>
                </View>

                <Text style={styles.sectionLabel}>PAST SOIL ANALYSES</Text>
                {DEMO_RECOMMENDATIONS.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => router.push(`/demo/recommendation?id=${item.id}` as never)}
                        activeOpacity={0.88}
                        accessibilityLabel={`Open recommendation from ${item.displayDate}`}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberText}>{String(DEMO_RECOMMENDATIONS.length - index).padStart(2, '0')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.date}>{item.displayDate}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={22} color="#7D887F" />
                        </View>

                        <View style={styles.cropBox}>
                            <View style={styles.cropNameRow}>
                                <Ionicons name="leaf" size={17} color="#257447" />
                                <Text style={styles.bestMatch}>Recommended crop</Text>
                            </View>
                            <View style={styles.cropResultRow}>
                                <Text style={styles.crop}>{item.crop}</Text>
                                <Text style={styles.confidence}>{item.confidence}% match</Text>
                            </View>
                        </View>

                        <View style={styles.metrics}>
                            <SmallMetric label="pH" value={item.soil.ph} />
                            <SmallMetric label="Moisture" value={item.soil.moisture} />
                            <SmallMetric label="Texture" value={item.soil.texture} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <DemoBottomNav />
        </SafeAreaView>
    );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.smallMetric}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F7F1' },
    header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#102418', fontSize: 24, fontWeight: '900', marginTop: 9 },
    subtitle: { color: '#6F7B72', fontSize: 12, marginTop: 4 },
    historyIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#DFECDE', alignItems: 'center', justifyContent: 'center' },
    content: { paddingHorizontal: 20, paddingBottom: 28 },
    insightBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 16, backgroundColor: '#E5F2E6', borderWidth: 1, borderColor: '#CDE2CF', marginBottom: 22 },
    insightTitle: { color: '#1A5330', fontWeight: '900', fontSize: 13 },
    insightText: { color: '#50705A', fontSize: 11, lineHeight: 16, marginTop: 2 },
    sectionLabel: { color: '#768178', fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginBottom: 10 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 13, borderWidth: 1, borderColor: '#E0E7DC' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
    numberBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#0B4D26', alignItems: 'center', justifyContent: 'center' },
    numberText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
    cardTitle: { color: '#1B3021', fontWeight: '900', fontSize: 15 },
    date: { color: '#7C877F', fontSize: 10, marginTop: 3 },
    cropBox: { backgroundColor: '#F1F7EE', borderRadius: 13, padding: 12, marginTop: 14 },
    cropNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    bestMatch: { color: '#5D7464', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    cropResultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 5 },
    crop: { color: '#153722', fontWeight: '900', fontSize: 17 },
    confidence: { color: '#257447', fontSize: 11, fontWeight: '900' },
    metrics: { flexDirection: 'row', gap: 7, marginTop: 11 },
    smallMetric: { flex: 1, backgroundColor: '#F8F9F6', paddingHorizontal: 9, paddingVertical: 8, borderRadius: 10 },
    metricLabel: { color: '#89928B', fontSize: 9 },
    metricValue: { color: '#304138', fontSize: 11, fontWeight: '800', marginTop: 2 },
});

