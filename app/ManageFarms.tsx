import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';

import NotificationBell from '@/components/NotificationBell';
import StatusModal from '@/components/ui/StatusModal';
import { useSidebar } from '@/context/SidebarContext';
import { COUNTRIES, SOIL_TYPES } from '@/constants/LocationData';
import { authApi } from '@/services/api';
import { writeStoredUser } from '@/utils/session';

type Farm = {
  id: string;
  name: string;
  size: number | string;
  soilType: string;
  country?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  ownerName?: string;
  ownerPhone?: string | null;
  ownerEmail?: string;
  irrigationMethod?: string | null;
  cropHistory?: string[] | string | null;
  farmingPractices?: string | null;
  soilInformation?: string | null;
  createdAt?: string;
};

type FarmForm = {
  farmName: string;
  farmSize: string;
  soilType: string;
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  ownerName: string;
  phoneNumber: string;
  emailAddress: string;
  irrigationMethod: string;
  cropHistory: string;
  farmingPractices: string;
  soilInformation: string;
};

const emptyForm: FarmForm = {
  farmName: '',
  farmSize: '',
  soilType: '',
  country: 'Rwanda',
  province: '',
  district: '',
  sector: '',
  cell: '',
  village: '',
  ownerName: '',
  phoneNumber: '',
  emailAddress: '',
  irrigationMethod: '',
  cropHistory: '',
  farmingPractices: '',
  soilInformation: '',
};

const soilLabel = (value?: string) =>
  SOIL_TYPES.find((soil) => soil.id === value)?.label || value || 'Unknown';

const listLabel = (value?: string[] | string | null) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
};

export default function ManageFarms() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [form, setForm] = useState<FarmForm>(emptyForm);
  const [dropdown, setDropdown] = useState<'soilType' | 'country' | null>(null);
  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'info',
    title: '',
    message: '',
  });

  const farmCountLabel = useMemo(() => {
    if (farms.length === 1) return '1 farm registered';
    return `${farms.length} farms registered`;
  }, [farms.length]);

  const showStatus = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setStatusModal({ visible: true, type, title, message });
  };

  const loadFarms = useCallback(async () => {
    try {
      const response = await authApi.getFarms();
      const farmList = Array.isArray(response?.farms) ? response.farms : [];
      setFarms(farmList);
    } catch (error: any) {
      showStatus('error', 'Could not load farms', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const openCreate = () => {
    router.push('/RegisterFarm');
  };

  const openEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setForm({
      farmName: farm.name || '',
      farmSize: String(farm.size ?? ''),
      soilType: farm.soilType || '',
      country: farm.country || 'Rwanda',
      province: farm.province || '',
      district: farm.district || '',
      sector: farm.sector || '',
      cell: farm.cell || '',
      village: farm.village || '',
      ownerName: farm.ownerName || '',
      phoneNumber: farm.ownerPhone || '',
      emailAddress: farm.ownerEmail || '',
      irrigationMethod: farm.irrigationMethod || '',
      cropHistory: listLabel(farm.cropHistory),
      farmingPractices: farm.farmingPractices || '',
      soilInformation: farm.soilInformation || '',
    });
    setDropdown(null);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!form.farmName.trim() || !form.farmSize.trim() || !form.soilType) {
      showStatus('info', 'Required fields', 'Farm name, farm size, and soil type are required.');
      return false;
    }
    if (!form.country.trim() || !form.province.trim() || !form.district.trim()) {
      showStatus('info', 'Location required', 'Country, province, and district are required.');
      return false;
    }
    if (!form.sector.trim() || !form.cell.trim() || !form.village.trim()) {
      showStatus('info', 'Location required', 'Sector, cell, and village are required.');
      return false;
    }
    if (!form.ownerName.trim() || !form.emailAddress.trim()) {
      showStatus('info', 'Owner required', 'Owner name and email address are required.');
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    name: form.farmName.trim(),
    size: parseFloat(form.farmSize) || 0,
    soilType: form.soilType,
    country: form.country.trim(),
    province: form.province.trim(),
    district: form.district.trim(),
    sector: form.sector.trim(),
    cell: form.cell.trim(),
    village: form.village.trim(),
    ownerName: form.ownerName.trim(),
    ownerEmail: form.emailAddress.trim(),
    ownerPhone: form.phoneNumber.trim() || undefined,
    irrigationMethod: form.irrigationMethod.trim() || undefined,
    cropHistory: form.cropHistory
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    farmingPractices: form.farmingPractices.trim() || undefined,
    soilInformation: form.soilInformation.trim() || undefined,
  });

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (!editingFarm) {
        return;
      }
      await authApi.updateFarm(editingFarm.id, buildPayload());
      showStatus('success', 'Farm updated', 'Your farm details were saved.');
      setModalVisible(false);
      await loadFarms();
      try {
        const profile = await authApi.getProfile('');
        if (profile?.user) await writeStoredUser(profile.user);
      } catch {
        // Farm list is already refreshed.
      }
    } catch (error: any) {
      showStatus('error', 'Update failed', error?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (farm: Farm) => {
    Alert.alert(
      'Delete farm',
      `Remove ${farm.name} from your active farms?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await authApi.deleteFarm(farm.id);
              const preferredFarmId = await AsyncStorage.getItem('preferredFarmId');
              if (preferredFarmId === farm.id) {
                await AsyncStorage.removeItem('preferredFarmId');
              }
              showStatus('success', 'Farm removed', `${farm.name} was removed from active farms.`);
              await loadFarms();
            } catch (error: any) {
              showStatus('error', 'Delete failed', error?.message || 'Please try again.');
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton} accessibilityLabel="Open menu">
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Farms</Text>
        <NotificationBell color="#fff" size={24} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor="#0B4D26"
            onRefresh={() => {
              setRefreshing(true);
              loadFarms();
            }}
          />
        }
      >
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryTitle}>My Farms</Text>
            <Text style={styles.summaryText}>{loading ? 'Loading farms...' : farmCountLabel}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openCreate} activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color="#0B4D26" />
          </View>
        ) : farms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={38} color="#0B4D26" />
            <Text style={styles.emptyTitle}>No farms yet</Text>
            <Text style={styles.emptyText}>Create your first farm to unlock recommendations and weather tracking.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openCreate}>
              <Text style={styles.emptyButtonText}>Create Farm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          farms.map((farm) => (
            <View key={farm.id} style={styles.farmCard}>
              <View style={styles.farmTopRow}>
                <View style={styles.farmIcon}>
                  <Ionicons name="leaf" size={22} color="#0B4D26" />
                </View>
                <View style={styles.farmTitleWrap}>
                  <Text style={styles.farmName} numberOfLines={1}>{farm.name || 'Unnamed farm'}</Text>
                  <Text style={styles.farmLocation} numberOfLines={1}>
                    {[farm.village, farm.cell, farm.district].filter(Boolean).join(', ') || 'Location not set'}
                  </Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Size</Text>
                  <Text style={styles.metaValue}>{farm.size ?? '-'} ha</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Soil</Text>
                  <Text style={styles.metaValue}>{soilLabel(farm.soilType)}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => openEdit(farm)}>
                  <Ionicons name="create-outline" size={18} color="#0B4D26" />
                  <Text style={styles.secondaryActionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(farm)}>
                  <Ionicons name="trash-outline" size={18} color="#B91C1C" />
                  <Text style={styles.deleteActionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Farm</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.sheetClose}>
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
              <TextInput
                style={styles.input}
                placeholder="Farm name"
                placeholderTextColor="#8A968B"
                value={form.farmName}
                onChangeText={(text) => setForm((prev) => ({ ...prev, farmName: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Farm size"
                placeholderTextColor="#8A968B"
                keyboardType="numeric"
                value={form.farmSize}
                onChangeText={(text) => setForm((prev) => ({ ...prev, farmSize: text }))}
              />

              <TouchableOpacity style={styles.selectInput} onPress={() => setDropdown(dropdown === 'soilType' ? null : 'soilType')}>
                <Text style={form.soilType ? styles.selectText : styles.placeholderText}>
                  {soilLabel(form.soilType) || 'Soil type'}
                </Text>
                <Ionicons name={dropdown === 'soilType' ? 'chevron-up' : 'chevron-down'} size={18} color="#374151" />
              </TouchableOpacity>
              {dropdown === 'soilType' && (
                <View style={styles.dropdownMenu}>
                  {SOIL_TYPES.map((soil) => (
                    <TouchableOpacity
                      key={soil.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, soilType: soil.id }));
                        setDropdown(null);
                      }}
                    >
                      <Text style={styles.dropdownText}>{soil.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.selectInput} onPress={() => setDropdown(dropdown === 'country' ? null : 'country')}>
                <Text style={form.country ? styles.selectText : styles.placeholderText}>{form.country || 'Country'}</Text>
                <Ionicons name={dropdown === 'country' ? 'chevron-up' : 'chevron-down'} size={18} color="#374151" />
              </TouchableOpacity>
              {dropdown === 'country' && (
                <View style={styles.dropdownMenu}>
                  {COUNTRIES.map((country) => (
                    <TouchableOpacity
                      key={country.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, country: country.label }));
                        setDropdown(null);
                      }}
                    >
                      <Text style={styles.dropdownText}>{country.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.twoColumns}>
                <TextInput
                  style={[styles.input, styles.columnInput]}
                  placeholder="Province"
                  placeholderTextColor="#8A968B"
                  value={form.province}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, province: text }))}
                />
                <TextInput
                  style={[styles.input, styles.columnInput]}
                  placeholder="District"
                  placeholderTextColor="#8A968B"
                  value={form.district}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, district: text }))}
                />
              </View>
              <View style={styles.twoColumns}>
                <TextInput
                  style={[styles.input, styles.columnInput]}
                  placeholder="Sector"
                  placeholderTextColor="#8A968B"
                  value={form.sector}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, sector: text }))}
                />
                <TextInput
                  style={[styles.input, styles.columnInput]}
                  placeholder="Cell"
                  placeholderTextColor="#8A968B"
                  value={form.cell}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, cell: text }))}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Village"
                placeholderTextColor="#8A968B"
                value={form.village}
                onChangeText={(text) => setForm((prev) => ({ ...prev, village: text }))}
              />

              <TextInput
                style={styles.input}
                placeholder="Owner name"
                placeholderTextColor="#8A968B"
                value={form.ownerName}
                onChangeText={(text) => setForm((prev) => ({ ...prev, ownerName: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Owner email"
                placeholderTextColor="#8A968B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.emailAddress}
                onChangeText={(text) => setForm((prev) => ({ ...prev, emailAddress: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#8A968B"
                keyboardType="phone-pad"
                value={form.phoneNumber}
                onChangeText={(text) => setForm((prev) => ({ ...prev, phoneNumber: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Irrigation method"
                placeholderTextColor="#8A968B"
                value={form.irrigationMethod}
                onChangeText={(text) => setForm((prev) => ({ ...prev, irrigationMethod: text }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Crop history, comma separated"
                placeholderTextColor="#8A968B"
                value={form.cropHistory}
                onChangeText={(text) => setForm((prev) => ({ ...prev, cropHistory: text }))}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Farming practices"
                placeholderTextColor="#8A968B"
                multiline
                value={form.farmingPractices}
                onChangeText={(text) => setForm((prev) => ({ ...prev, farmingPractices: text }))}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Soil information"
                placeholderTextColor="#8A968B"
                multiline
                value={form.soilInformation}
                onChangeText={(text) => setForm((prev) => ({ ...prev, soilInformation: text }))}
              />
            </ScrollView>

            <View style={styles.sheetFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)} disabled={saving}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusModal
        visible={statusModal.visible}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F1',
  },
  header: {
    backgroundColor: '#0B4D26',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#102418',
    fontSize: 22,
    fontWeight: '800',
  },
  summaryText: {
    color: '#66736B',
    fontSize: 13,
    marginTop: 3,
  },
  addButton: {
    minWidth: 92,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0B4D26',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  centerState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#102418',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#66736B',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
  emptyButton: {
    marginTop: 18,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0B4D26',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  farmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8D8',
    shadowColor: '#12351E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  farmTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  farmIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  farmTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  farmName: {
    color: '#102418',
    fontSize: 16,
    fontWeight: '800',
  },
  farmLocation: {
    color: '#66736B',
    fontSize: 12,
    marginTop: 3,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metaItem: {
    flex: 1,
    backgroundColor: '#F4F7EF',
    borderRadius: 10,
    padding: 10,
  },
  metaLabel: {
    color: '#66736B',
    fontSize: 11,
    fontWeight: '700',
  },
  metaValue: {
    color: '#102418',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryAction: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B9DCC7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    color: '#0B4D26',
    fontWeight: '800',
  },
  deleteAction: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0C7C7',
    backgroundColor: '#FFF7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteActionText: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.50)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  sheetHeader: {
    minHeight: 58,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    color: '#102418',
    fontSize: 18,
    fontWeight: '800',
  },
  sheetClose: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  sheetContent: {
    padding: 18,
    paddingBottom: 8,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D7DFD1',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#101828',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 84,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  selectInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D7DFD1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#101828',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderText: {
    color: '#8A968B',
    fontSize: 14,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#D7DFD1',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: -6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2ED',
  },
  dropdownText: {
    color: '#101828',
    fontSize: 14,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  columnInput: {
    flex: 1,
  },
  sheetFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '800',
  },
  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#0B4D26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});
