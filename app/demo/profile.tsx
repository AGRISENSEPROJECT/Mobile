import DemoBadge from '@/components/demo/DemoBadge';
import DemoBottomNav from '@/components/demo/DemoBottomNav';
import { DEMO_FARM, DEMO_FARMER } from '@/constants/demoFarmer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DemoProfile() {
    const router = useRouter();

    const signOut = async () => {
        await AsyncStorage.multiRemove(['demoMode', 'token', 'refreshToken', 'user', 'preferredFarmId']);
        router.replace('/signin');
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headingRow}>
                    <View>
                        <DemoBadge />
                        <Text style={styles.pageTitle}>Farmer profile</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton} accessibilityLabel="Profile settings">
                        <Ionicons name="settings-outline" size={23} color="#0B4D26" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>JH</Text>
                        <View style={styles.verifiedDot}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                    </View>
                    <Text style={styles.name}>{DEMO_FARMER.displayName}</Text>
                    <Text style={styles.role}>Registered farmer</Text>
                    <View style={styles.verifiedPill}>
                        <Ionicons name="shield-checkmark" size={15} color="#257447" />
                        <Text style={styles.verifiedText}>Verified account</Text>
                    </View>
                </View>

                <SectionTitle title="PERSONAL INFORMATION" />
                <View style={styles.detailsCard}>
                    <DetailRow icon="mail-outline" label="Email address" value={DEMO_FARMER.email} />
                    <DetailRow icon="call-outline" label="Phone number" value={DEMO_FARMER.phoneNumber} />
                    <DetailRow icon="calendar-outline" label="Member since" value="12 February 2026" isLast />
                </View>

                <SectionTitle title="REGISTERED FARM" />
                <View style={styles.farmCard}>
                    <View style={styles.farmHeader}>
                        <View style={styles.farmIcon}>
                            <Ionicons name="leaf" size={23} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.farmName}>{DEMO_FARM.name}</Text>
                            <Text style={styles.farmLocation}>{DEMO_FARM.village}, {DEMO_FARM.sector}, {DEMO_FARM.district}</Text>
                        </View>
                        <View style={styles.activePill}><Text style={styles.activeText}>Active</Text></View>
                    </View>
                    <View style={styles.farmGrid}>
                        <FarmField label="Farm size" value={DEMO_FARM.size} />
                        <FarmField label="Primary crop" value={DEMO_FARM.primaryCrop} />
                        <FarmField label="Analyses made" value="3 soil scans" />
                        <FarmField label="Latest analysis" value="18 Sep 2026" />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={signOut} accessibilityLabel="Sign out of demo account">
                    <Ionicons name="log-out-outline" size={20} color="#B42318" />
                    <Text style={styles.logoutText}>Sign out</Text>
                </TouchableOpacity>
            </ScrollView>
            <DemoBottomNav />
        </SafeAreaView>
    );
}

function SectionTitle({ title }: { title: string }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
}

function DetailRow({ icon, label, value, isLast = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; isLast?: boolean }) {
    return (
        <View style={[styles.detailRow, !isLast && styles.detailBorder]}>
            <View style={styles.detailIcon}><Ionicons name={icon} size={19} color="#34643F" /></View>
            <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        </View>
    );
}

function FarmField({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.farmField}>
            <Text style={styles.farmFieldLabel}>{label}</Text>
            <Text style={styles.farmFieldValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F7F1' },
    content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 26 },
    headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { color: '#102418', fontSize: 24, fontWeight: '900', marginTop: 9 },
    settingsButton: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#E2EDE0', alignItems: 'center', justifyContent: 'center' },
    profileCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginTop: 17, borderWidth: 1, borderColor: '#E0E7DC' },
    avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#DDEBDD', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    avatarText: { color: '#0B4D26', fontWeight: '900', fontSize: 26 },
    verifiedDot: { position: 'absolute', right: 0, bottom: 2, width: 23, height: 23, borderRadius: 12, backgroundColor: '#257447', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
    name: { color: '#14291B', fontSize: 20, fontWeight: '900', marginTop: 12 },
    role: { color: '#718077', fontSize: 12, marginTop: 3 },
    verifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E7F4E9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginTop: 10 },
    verifiedText: { color: '#257447', fontWeight: '800', fontSize: 11 },
    sectionTitle: { color: '#768178', fontSize: 10, fontWeight: '900', letterSpacing: 0.9, marginTop: 22, marginBottom: 9 },
    detailsCard: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E0E7DC' },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    detailBorder: { borderBottomWidth: 1, borderBottomColor: '#E8ECE5' },
    detailIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#EEF4EA', alignItems: 'center', justifyContent: 'center' },
    detailLabel: { color: '#889189', fontSize: 10 },
    detailValue: { color: '#26382C', fontSize: 13, fontWeight: '800', marginTop: 3 },
    farmCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E0E7DC' },
    farmHeader: { flexDirection: 'row', gap: 11, alignItems: 'center' },
    farmIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#0B4D26', alignItems: 'center', justifyContent: 'center' },
    farmName: { color: '#183021', fontSize: 15, fontWeight: '900' },
    farmLocation: { color: '#7A867E', fontSize: 10, marginTop: 3 },
    activePill: { backgroundColor: '#E5F3E7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5 },
    activeText: { color: '#257447', fontSize: 9, fontWeight: '900' },
    farmGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
    farmField: { width: '48%', backgroundColor: '#F5F8F2', borderRadius: 11, padding: 10 },
    farmFieldLabel: { color: '#8A938C', fontSize: 9 },
    farmFieldValue: { color: '#304137', fontSize: 11, fontWeight: '800', marginTop: 3 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#F0C5C1', backgroundColor: '#FFF7F6', borderRadius: 14, paddingVertical: 13, marginTop: 22 },
    logoutText: { color: '#B42318', fontWeight: '900', fontSize: 13 },
});

