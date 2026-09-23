import DemoBadge from '@/components/demo/DemoBadge';
import DemoBottomNav from '@/components/demo/DemoBottomNav';
import { DEMO_FARM, DEMO_FARMER, DEMO_RECOMMENDATIONS, LATEST_DEMO_RECOMMENDATION } from '@/constants/demoFarmer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DemoDashboard() {
    const router = useRouter();
    const latest = LATEST_DEMO_RECOMMENDATION;

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.topBar}>
                <View>
                    <DemoBadge />
                    <Text style={styles.greeting}>Good morning, {DEMO_FARMER.firstName}</Text>
                    <Text style={styles.subGreeting}>Here is what is happening on your farm.</Text>
                </View>
                <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => router.push('/demo/profile' as never)}
                    accessibilityLabel="Open farmer profile"
                >
                    <Text style={styles.avatarText}>JH</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.farmCard}>
                    <View style={styles.farmCardTop}>
                        <View style={styles.farmIcon}>
                            <Ionicons name="leaf" size={24} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.farmEyebrow}>ACTIVE FARM</Text>
                            <Text style={styles.farmName}>{DEMO_FARM.name}</Text>
                            <Text style={styles.farmLocation}>{DEMO_FARM.sector}, {DEMO_FARM.district}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color="#CFE4D4" />
                    </View>
                    <View style={styles.farmStats}>
                        <FarmStat label="Farm size" value={DEMO_FARM.size} />
                        <View style={styles.statDivider} />
                        <FarmStat label="Main crop" value={DEMO_FARM.primaryCrop} />
                    </View>
                </View>

                <View style={styles.sectionHeadingRow}>
                    <View>
                        <Text style={styles.sectionTitle}>Latest soil analysis</Text>
                        <Text style={styles.sectionSubtitle}>{latest.displayDate}</Text>
                    </View>
                    <View style={styles.completedPill}>
                        <Ionicons name="checkmark-circle" size={14} color="#257447" />
                        <Text style={styles.completedText}>{latest.status}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.analysisCard}
                    onPress={() => router.push(`/demo/recommendation?id=${latest.id}` as never)}
                    activeOpacity={0.9}
                    accessibilityLabel={`Open latest recommendation for ${latest.crop}`}
                >
                    <View style={styles.cropRow}>
                        <View style={styles.cropIcon}>
                            <Ionicons name="nutrition" size={27} color="#0B4D26" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bestCropLabel}>BEST CROP MATCH</Text>
                            <Text style={styles.cropName}>{latest.crop}</Text>
                        </View>
                        <View style={styles.scoreCircle}>
                            <Text style={styles.scoreValue}>{latest.confidence}%</Text>
                            <Text style={styles.scoreLabel}>match</Text>
                        </View>
                    </View>

                    <Text style={styles.summary}>{latest.summary}</Text>

                    <View style={styles.metricRow}>
                        <Metric icon="water-outline" label="Moisture" value={latest.soil.moisture} />
                        <Metric icon="flask-outline" label="Soil pH" value={latest.soil.ph} />
                        <Metric icon="thermometer-outline" label="Temp." value={latest.soil.temperature} />
                    </View>

                    <View style={styles.openRow}>
                        <Text style={styles.openText}>View full recommendation</Text>
                        <Ionicons name="arrow-forward" size={18} color="#0B4D26" />
                    </View>
                </TouchableOpacity>

                <View style={styles.sectionHeadingRow}>
                    <Text style={styles.sectionTitle}>Recent activity</Text>
                    <TouchableOpacity onPress={() => router.push('/demo/recommendations' as never)}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.activityCard}>
                    {DEMO_RECOMMENDATIONS.slice(0, 3).map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.activityRow, index < 2 && styles.activityBorder]}
                            onPress={() => router.push(`/demo/recommendation?id=${item.id}` as never)}
                            accessibilityLabel={`Open ${item.title}`}
                        >
                            <View style={styles.activityIcon}>
                                <Ionicons name="analytics-outline" size={20} color="#34643F" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.activityTitle}>{item.title}</Text>
                                <Text style={styles.activityMeta}>{item.displayDate} · {item.crop}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#879087" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <DemoBottomNav />
        </SafeAreaView>
    );
}

function FarmStat({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.farmStatLabel}>{label}</Text>
            <Text style={styles.farmStatValue}>{value}</Text>
        </View>
    );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
    return (
        <View style={styles.metric}>
            <Ionicons name={icon} size={18} color="#34643F" />
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F7F1' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
    greeting: { color: '#102418', fontSize: 23, fontWeight: '900', marginTop: 9 },
    subGreeting: { color: '#6B776F', fontSize: 13, marginTop: 3 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DDE9DC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
    avatarText: { color: '#0B4D26', fontWeight: '900', fontSize: 16 },
    content: { paddingHorizontal: 20, paddingBottom: 28 },
    farmCard: { backgroundColor: '#0B4D26', borderRadius: 20, padding: 18, marginBottom: 24 },
    farmCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    farmIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    farmEyebrow: { color: '#A9C8B1', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
    farmName: { color: '#FFFFFF', fontSize: 19, fontWeight: '900', marginTop: 2 },
    farmLocation: { color: '#CFE4D4', fontSize: 12, marginTop: 2 },
    farmStats: { flexDirection: 'row', marginTop: 17, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
    statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.16)', marginHorizontal: 18 },
    farmStatLabel: { color: '#A9C8B1', fontSize: 11 },
    farmStatValue: { color: '#FFFFFF', fontWeight: '800', fontSize: 13, marginTop: 3 },
    sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { color: '#15271B', fontSize: 18, fontWeight: '900' },
    sectionSubtitle: { color: '#78837B', fontSize: 12, marginTop: 3 },
    completedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E3F4E7', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
    completedText: { color: '#257447', fontSize: 11, fontWeight: '800' },
    analysisCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 17, borderWidth: 1, borderColor: '#E0E7DC', marginBottom: 25 },
    cropRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cropIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#E8F2E5', alignItems: 'center', justifyContent: 'center' },
    bestCropLabel: { color: '#748078', fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
    cropName: { color: '#11261A', fontSize: 20, fontWeight: '900', marginTop: 2 },
    scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E7F4E9', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#B9DEC2' },
    scoreValue: { color: '#146637', fontWeight: '900', fontSize: 14 },
    scoreLabel: { color: '#538263', fontSize: 9, fontWeight: '700' },
    summary: { color: '#59665D', fontSize: 13, lineHeight: 19, marginTop: 15 },
    metricRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
    metric: { flex: 1, backgroundColor: '#F5F8F2', borderRadius: 12, alignItems: 'center', paddingVertical: 10 },
    metricValue: { color: '#1D3224', fontSize: 12, fontWeight: '900', marginTop: 3 },
    metricLabel: { color: '#849087', fontSize: 9, marginTop: 1 },
    openRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E8ECE5', paddingTop: 14, marginTop: 15 },
    openText: { color: '#0B4D26', fontSize: 13, fontWeight: '900' },
    seeAll: { color: '#0B4D26', fontWeight: '800', fontSize: 13 },
    activityCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E0E7DC' },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 14 },
    activityBorder: { borderBottomWidth: 1, borderBottomColor: '#E9EDE6' },
    activityIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EDF3E9', alignItems: 'center', justifyContent: 'center' },
    activityTitle: { color: '#203026', fontWeight: '800', fontSize: 13 },
    activityMeta: { color: '#7C877F', fontSize: 10, marginTop: 3 },
});

