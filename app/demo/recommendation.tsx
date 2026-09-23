import DemoBadge from '@/components/demo/DemoBadge';
import { DEMO_RECOMMENDATIONS, LATEST_DEMO_RECOMMENDATION } from '@/constants/demoFarmer';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DemoRecommendationDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const recommendation = DEMO_RECOMMENDATIONS.find((item) => item.id === id) || LATEST_DEMO_RECOMMENDATION;

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
                    <Ionicons name="arrow-back" size={22} color="#173220" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Analysis result</Text>
                    <Text style={styles.headerDate}>{recommendation.displayDate}</Text>
                </View>
                <DemoBadge />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.heroTop}>
                        <View style={styles.heroIcon}><Ionicons name="leaf" size={27} color="#FFFFFF" /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroEyebrow}>TOP RECOMMENDATION</Text>
                            <Text style={styles.heroCrop}>{recommendation.crop}</Text>
                        </View>
                        <View style={styles.heroScore}>
                            <Text style={styles.heroScoreValue}>{recommendation.confidence}%</Text>
                            <Text style={styles.heroScoreLabel}>confidence</Text>
                        </View>
                    </View>
                    <Text style={styles.heroSummary}>{recommendation.summary}</Text>
                </View>

                <Text style={styles.sectionTitle}>SOIL READINGS</Text>
                <View style={styles.soilGrid}>
                    <SoilReading icon="water-outline" label="Moisture" value={recommendation.soil.moisture} status="Good" />
                    <SoilReading icon="thermometer-outline" label="Temperature" value={recommendation.soil.temperature} status="Optimal" />
                    <SoilReading icon="flask-outline" label="Soil pH" value={recommendation.soil.ph} status="Suitable" />
                    <SoilReading icon="layers-outline" label="Texture" value={recommendation.soil.texture} status="Good" />
                </View>

                <Text style={styles.sectionTitle}>NUTRIENT LEVELS</Text>
                <View style={styles.nutrientCard}>
                    <NutrientRow label="Nitrogen (N)" value={recommendation.soil.nitrogen} percent={70} />
                    <NutrientRow label="Phosphorus (P)" value={recommendation.soil.phosphorus} percent={61} />
                    <NutrientRow label="Potassium (K)" value={recommendation.soil.potassium} percent={84} isLast />
                </View>

                <Text style={styles.sectionTitle}>RECOMMENDED ACTIONS</Text>
                <AdviceCard icon="flask" title="Fertilizer plan" text={recommendation.fertilizer} color="#885F16" background="#FFF5DD" />
                <AdviceCard icon="water" title="Irrigation advice" text={recommendation.irrigation} color="#216A86" background="#E9F6FA" />
                <AdviceCard icon="bug" title="Pest & disease prevention" text={recommendation.pestAdvice} color="#7A3F38" background="#FFF0EC" />

                <View style={styles.recordBox}>
                    <Ionicons name="checkmark-circle" size={20} color="#257447" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.recordTitle}>Analysis completed and saved</Text>
                        <Text style={styles.recordText}>This recommendation is available in the farmer&apos;s analysis history.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function SoilReading({ icon, label, value, status }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; status: string }) {
    return (
        <View style={styles.soilReading}>
            <View style={styles.readingIcon}><Ionicons name={icon} size={20} color="#34643F" /></View>
            <Text style={styles.readingLabel}>{label}</Text>
            <Text style={styles.readingValue}>{value}</Text>
            <Text style={styles.readingStatus}>{status}</Text>
        </View>
    );
}

function NutrientRow({ label, value, percent, isLast = false }: { label: string; value: string; percent: number; isLast?: boolean }) {
    return (
        <View style={[styles.nutrientRow, !isLast && styles.nutrientBorder]}>
            <View style={styles.nutrientHeader}>
                <Text style={styles.nutrientLabel}>{label}</Text>
                <Text style={styles.nutrientValue}>{value}</Text>
            </View>
            <View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View>
        </View>
    );
}

function AdviceCard({ icon, title, text, color, background }: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string; color: string; background: string }) {
    return (
        <View style={[styles.adviceCard, { backgroundColor: background }]}>
            <View style={[styles.adviceIcon, { backgroundColor: color }]}><Ionicons name={icon} size={18} color="#FFFFFF" /></View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.adviceTitle, { color }]}>{title}</Text>
                <Text style={styles.adviceText}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F7F1' },
    header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14 },
    backButton: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE6DC', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#15291C', fontSize: 17, fontWeight: '900' },
    headerDate: { color: '#7B877E', fontSize: 10, marginTop: 2 },
    content: { paddingHorizontal: 18, paddingBottom: 30 },
    hero: { backgroundColor: '#0B4D26', borderRadius: 20, padding: 17 },
    heroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    heroIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    heroEyebrow: { color: '#A8CAB1', fontSize: 9, letterSpacing: 0.8, fontWeight: '900' },
    heroCrop: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', marginTop: 2 },
    heroScore: { alignItems: 'center' },
    heroScoreValue: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
    heroScoreLabel: { color: '#B9D1BF', fontSize: 8 },
    heroSummary: { color: '#D6E5D9', fontSize: 12, lineHeight: 18, marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.16)' },
    sectionTitle: { color: '#758078', fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginTop: 22, marginBottom: 9 },
    soilGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
    soilReading: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 13, borderWidth: 1, borderColor: '#E1E7DE' },
    readingIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EDF4E9', alignItems: 'center', justifyContent: 'center' },
    readingLabel: { color: '#859088', fontSize: 9, marginTop: 9 },
    readingValue: { color: '#263A2D', fontSize: 15, fontWeight: '900', marginTop: 2 },
    readingStatus: { color: '#257447', fontSize: 9, fontWeight: '800', marginTop: 4 },
    nutrientCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E1E7DE' },
    nutrientRow: { paddingVertical: 13 },
    nutrientBorder: { borderBottomWidth: 1, borderBottomColor: '#E9EDE7' },
    nutrientHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    nutrientLabel: { color: '#35463B', fontSize: 11, fontWeight: '800' },
    nutrientValue: { color: '#657168', fontSize: 10, fontWeight: '700' },
    track: { height: 6, backgroundColor: '#E8EDE6', borderRadius: 999, marginTop: 8, overflow: 'hidden' },
    fill: { height: '100%', backgroundColor: '#4A8B59', borderRadius: 999 },
    adviceCard: { flexDirection: 'row', gap: 11, padding: 14, borderRadius: 15, marginBottom: 9 },
    adviceIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    adviceTitle: { fontSize: 12, fontWeight: '900' },
    adviceText: { color: '#4F5C53', fontSize: 11, lineHeight: 17, marginTop: 4 },
    recordBox: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#E8F4E9', borderColor: '#CDE3D1', borderWidth: 1, borderRadius: 14, padding: 13, marginTop: 13 },
    recordTitle: { color: '#245D38', fontSize: 11, fontWeight: '900' },
    recordText: { color: '#5D7464', fontSize: 9, marginTop: 2 },
});

