import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '@/config/env';
import { authApi } from '@/services/api';
import { isFarmerRole } from '@/utils/userDisplay';
import { clearSession, getPostAuthRoute, writeStoredUser } from '@/utils/session';

const API_URL_KEY = 'api_url_bound';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentApi = ENV.API_URL || '';
        const boundApi = await AsyncStorage.getItem(API_URL_KEY);

        // Tokens from another API host must not be trusted.
        if (boundApi && currentApi && boundApi !== currentApi) {
          await clearSession();
          await AsyncStorage.setItem(API_URL_KEY, currentApi);
          setChecking(false);
          return;
        }

        if (currentApi && !boundApi) {
          await AsyncStorage.setItem(API_URL_KEY, currentApi);
        }

        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');

        if (!token || !userJson) {
          setChecking(false);
          return;
        }

        const user = JSON.parse(userJson);

        try {
          const profile = await authApi.getProfile(token);
          const freshUser = profile?.user || user;

          if (!isFarmerRole(freshUser.role)) {
            await clearSession();
            setChecking(false);
            return;
          }

          if (profile?.user) {
            await writeStoredUser(profile.user);
            await AsyncStorage.setItem(API_URL_KEY, currentApi);
          }

          const skipFarm = (await AsyncStorage.getItem('skipFarm')) === 'true';
          router.replace(getPostAuthRoute(freshUser, { skipFarm }) as any);
        } catch {
          await clearSession();
          setChecking(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <SafeAreaView className="flex-1 bg-[#F6F8F1] items-center justify-center">
        <ActivityIndicator size="large" color="#0B4D26" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="w-screen h-screen bg-[#F6F8F1]">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-48 h-48 rounded-3xl bg-white items-center justify-center border border-[#E2E8D8] mb-8">
          <Image
            source={require('../assets/icon.png')}
            className="w-36 h-36"
            resizeMode="contain"
          />
        </View>

        <Text className="text-[#102418] text-3xl font-extrabold text-center mb-2">AgriSense</Text>
        <Text className="text-[#66736B] text-sm font-medium text-center leading-5 mb-8 max-w-[280px]">
          Soil insights, crop advice, weather, and farmer community in one place.
        </Text>

        <TouchableOpacity
          className="bg-[#0B4D26] px-14 py-4 rounded-xl"
          onPress={() => router.push('/signin')}
        >
          <Text className="text-white text-base font-extrabold">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
