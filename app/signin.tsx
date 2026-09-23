import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, BackHandler, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import { authApi } from '@/services/api';
import StatusModal from '@/components/ui/StatusModal';
import { isFarmerRole } from '@/utils/userDisplay';
import { getPostAuthRoute, persistAuthSession } from '@/utils/session';
import { useSidebar } from '@/context/SidebarContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { DEMO_CREDENTIALS, DEMO_FARMER, DEMO_MODE_ENABLED } from '@/constants/demoFarmer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHONE_RE = /^\+?[1-9]\d{1,14}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
    const router = useRouter();
    const { applyUser } = useSidebar();
    const [loading, setLoading] = useState(false);
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'error' as 'error' | 'success' | 'info',
        title: '',
        message: '',
    });
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        identifier: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const showGoogleFeedback = useCallback(
        (feedback: { type: 'error' | 'success' | 'info'; title: string; message: string }) => {
            setStatusModal({
                visible: true,
                type: feedback.type,
                title: feedback.title,
                message: feedback.message,
            });
        },
        [],
    );

    const { signInWithGoogle, loading: googleLoading } = useGoogleAuth({
        onFeedback: showGoogleFeedback,
    });

    const validateForm = () => {
        const id = formData.identifier.trim();
        let identifierError = '';
        if (!id) {
            identifierError = 'Email or phone number is required';
        } else if (id.includes('@')) {
            if (!EMAIL_RE.test(id)) identifierError = 'Invalid email format';
        } else if (PHONE_RE.test(id.replace(/[\s-]/g, ''))) {
            // valid phone (allow spaces/dashes typed by user — normalized on submit)
        } else if (/[a-zA-Z]/.test(id)) {
            identifierError =
                'Username login is not supported. Use your email or phone (e.g. +250788123456)';
        } else {
            identifierError = 'Use your email or phone in international format, e.g. +250788123456';
        }

        const newErrors = {
            identifier: identifierError,
            password: !formData.password ? 'Password is required' : '',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const id = formData.identifier.trim();

            if (
                DEMO_MODE_ENABLED &&
                id.toLowerCase() === DEMO_CREDENTIALS.email &&
                formData.password === DEMO_CREDENTIALS.password
            ) {
                await AsyncStorage.multiSet([
                    ['demoMode', 'true'],
                    ['token', 'demo-session-token'],
                    ['user', JSON.stringify(DEMO_FARMER)],
                    ['preferredFarmId', DEMO_FARMER.activeFarmId],
                ]);
                await applyUser(DEMO_FARMER);
                router.replace('/demo/dashboard' as never);
                return;
            }

            const payload = id.includes('@')
                ? { email: id, password: formData.password }
                : { phoneNumber: id.replace(/[\s-]/g, ''), password: formData.password };

            const data = await authApi.signin(payload);

            // HTTP 200 special body — email not verified, no tokens
            if (data.isEmailVerified === false) {
                router.push(
                    `/verifyEmail?email=${encodeURIComponent(data.email || (id.includes('@') ? id : ''))}&userId=${data.userId || ''}`,
                );
                return;
            }

            if (data.access_token && data.user) {
                if (!isFarmerRole(data.user.role)) {
                    setStatusModal({
                        visible: true,
                        type: 'info',
                        title: 'Farmer app only',
                        message:
                            'This mobile app is for farmer accounts. Please use the web portal for your role.',
                    });
                    return;
                }

                await persistAuthSession({
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    user: data.user,
                });
                await applyUser(data.user);

                router.replace(getPostAuthRoute(data.user) as any);
            }
        } catch (error: any) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Login Failed',
                message: error.message || 'Invalid credentials or email not verified',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            router.replace('/');
            return true;
        });
        return () => sub.remove();
    }, [router]);

    const handleBackPress = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F8F1]">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    onPress={handleBackPress}
                    className="mt-2 w-11 h-11 rounded-xl bg-white items-center justify-center border border-[#E2E8D8]"
                >
                    <Ionicons name="arrow-back" size={22} color="#102418" />
                </TouchableOpacity>

                <View className="mt-5">
                    <Text className="text-3xl font-extrabold text-[#102418]">Welcome back</Text>
                    <Text className="text-[#66736B] text-sm font-medium mt-2 leading-5">
                        Sign in to check your farms, recommendations, and community updates.
                    </Text>
                </View>

                <View className="items-center justify-center my-7">
                    <Image
                        source={require('../assets/login-illustration.png')}
                        className="w-60 h-60"
                        resizeMode="contain"
                    />
                </View>

                <View className="bg-white border border-[#E2E8D8] rounded-2xl p-4 mb-10">
                    {DEMO_MODE_ENABLED ? (
                        <View className="bg-[#FFF7E2] border border-[#F2D99B] rounded-xl p-3 mb-4">
                            <View className="flex-row items-center">
                                <Ionicons name="sparkles" size={18} color="#8A5A00" />
                                <Text className="text-[#694500] font-extrabold ml-2">Farmer journey demo</Text>
                            </View>
                            <Text className="text-[#80622A] text-xs mt-1 leading-4">
                                Load the assessment account, then tap Login to enter the simulated farmer journey.
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setFormData({
                                        identifier: DEMO_CREDENTIALS.email,
                                        password: DEMO_CREDENTIALS.password,
                                    });
                                    setErrors({ identifier: '', password: '' });
                                }}
                                className="bg-white border border-[#E9CD88] rounded-lg py-2.5 mt-3"
                                accessibilityLabel="Fill demo farmer credentials"
                            >
                                <Text className="text-[#765000] text-center text-sm font-extrabold">Use demo farmer account</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    <View>
                        <TextInput
                            placeholder="Email or phone (+250...), not username"
                            placeholderTextColor="#8A968B"
                            value={formData.identifier}
                            onChangeText={(text) => setFormData({ ...formData, identifier: text })}
                            className={`bg-[#F4F7EF] mb-3 px-4 py-4 rounded-xl border ${errors.identifier ? 'border-[#D92D20]' : 'border-[#D7DFD1]'} text-[#101828] font-semibold`}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.identifier ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.identifier}</Text>
                        ) : null}
                    </View>

                    <View className="relative">
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#8A968B"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry={!showPassword}
                            className={`bg-[#F4F7EF] px-4 py-4 pr-12 mb-3 rounded-xl border ${errors.password ? 'border-[#D92D20]' : 'border-[#D7DFD1]'} text-[#101828] font-semibold`}
                        />
                        {errors.password ? <Text className="text-red-500 text-sm mt-1">{errors.password}</Text> : null}
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4"
                        >
                            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#66736B" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/forgot-password')}
                        className="items-end"
                    >
                        <Text className="text-[#0B4D26] text-sm font-bold">Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={loading}
                        className={`bg-[#0B4D26] p-4 rounded-xl mt-5 shadow ${loading ? 'opacity-70' : ''}`}
                    >
                        <Text className="text-white text-center font-extrabold text-base">
                            {loading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>

                    <View className="mt-8">
                        <Text className="text-center text-[#8A968B] mb-4 font-semibold">or sign in with</Text>

                        <View className="flex-row justify-center space-x-6">
                            <TouchableOpacity
                                onPress={signInWithGoogle}
                                disabled={loading || googleLoading}
                                className={`w-11 h-11 rounded-xl bg-[#FFF7E6] items-center justify-center ${
                                    loading || googleLoading ? 'opacity-60' : ''
                                }`}
                                accessibilityLabel="Sign in with Google"
                            >
                                {googleLoading ? (
                                    <ActivityIndicator size="small" color="#DB4437" />
                                ) : (
                                    <AntDesign name="google" size={24} color="#DB4437" />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity className="w-11 h-11 rounded-xl bg-[#EEF3FF] items-center justify-center">
                                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-11 h-11 rounded-xl bg-[#EAF7FF] items-center justify-center">
                                <AntDesign name="twitter" size={24} color="#1DA1F2" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-11 h-11 rounded-xl bg-[#FFF0F6] items-center justify-center">
                                <AntDesign name="instagram" size={24} color="#E1306C" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-[#66736B] font-medium">Don&apos;t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text className="text-[#0B4D26] font-extrabold">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal({ ...statusModal, visible: false })}
            />
        </SafeAreaView>
    );
}
