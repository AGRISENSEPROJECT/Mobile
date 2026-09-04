import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { authApi } from '@/services/api';
import StatusModal from '@/components/ui/StatusModal';
import { validateStrongPassword } from '@/utils/password';

export default function Signup() {
    const router = useRouter();
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'error' as 'error' | 'success' | 'info',
        title: '',
        message: '',
    });
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Invalid email format';
        return '';
    };

    const validatePassword = (password: string) => validateStrongPassword(password);

    const validateName = (value: string, label: string, required = true) => {
        if (!value.trim()) return required ? `${label} is required` : '';
        if (value.trim().length < 1) return `${label} is required`;
        return '';
    };

    const validatePhone = (phone: string) => {
        if (!phone.trim()) return '';
        if (!/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
            return 'Use international format, e.g. +250788123456';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            email: validateEmail(formData.email),
            firstName: validateName(formData.firstName, 'First name'),
            lastName: validateName(formData.lastName, 'Last name', false),
            phoneNumber: validatePhone(formData.phoneNumber),
            password: validatePassword(formData.password),
            confirmPassword:
                formData.password !== formData.confirmPassword ? 'Passwords do not match' : '',
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== '');
    };

    const handleSignup = async () => {
        if (!validateForm()) return;
        if (!agreeToTerms) {
            setStatusModal({
                visible: true,
                type: 'info',
                title: 'Terms & Conditions',
                message: 'Please agree to the Terms and Conditions to continue',
            });
            return;
        }

        try {
            const payload: Parameters<typeof authApi.signup>[0] = {
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
            };
            if (formData.lastName.trim()) payload.lastName = formData.lastName.trim();
            if (formData.phoneNumber.trim()) payload.phoneNumber = formData.phoneNumber.trim();

            const data = await authApi.signup(payload);

            router.push(
                `/verifyEmail?email=${encodeURIComponent(formData.email.trim())}&userId=${data.userId}`,
            );
        } catch (error: any) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Signup Failed',
                message: error.message || 'An error occurred during signup',
            });
        }
    };

    const handleBackPress = () => {
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F8F1]">
            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={handleBackPress} className="mt-2 w-11 h-11 rounded-xl bg-white items-center justify-center border border-[#E2E8D8]">
                    <Ionicons name="arrow-back" size={22} color="#102418" />
                </TouchableOpacity>

                <View className="mt-5">
                    <Text className="text-3xl font-extrabold text-[#102418]">Create account</Text>
                    <Text className="text-[#66736B] mt-2 text-sm font-medium leading-5">
                        Sign up to access soil analysis, recommendations, community, and farm tools.
                    </Text>
                </View>

                <View className="mt-6 bg-white border border-[#E2E8D8] rounded-2xl p-4">
                    <View>
                        <TextInput
                            placeholder="Email address"
                            placeholderTextColor="#8A968B"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            className="bg-[#F4F7EF] px-4 py-4 mb-3 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email ? <Text className="text-red-500 text-sm mt-1">{errors.email}</Text> : null}
                    </View>

                    <View>
                        <TextInput
                            placeholder="First name"
                            placeholderTextColor="#8A968B"
                            value={formData.firstName}
                            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                            className="bg-[#F4F7EF] mb-3 px-4 py-4 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                            autoCapitalize="words"
                        />
                        {errors.firstName ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.firstName}</Text>
                        ) : null}
                    </View>

                    <View>
                        <TextInput
                            placeholder="Last name (optional)"
                            placeholderTextColor="#8A968B"
                            value={formData.lastName}
                            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                            className="bg-[#F4F7EF] mb-3 px-4 py-4 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                            autoCapitalize="words"
                        />
                        {errors.lastName ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.lastName}</Text>
                        ) : null}
                    </View>

                    <View>
                        <TextInput
                            placeholder="Phone (optional) e.g. +250788123456"
                            placeholderTextColor="#8A968B"
                            value={formData.phoneNumber}
                            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                            className="bg-[#F4F7EF] mb-3 px-4 py-4 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                            keyboardType="phone-pad"
                        />
                        {errors.phoneNumber ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.phoneNumber}</Text>
                        ) : null}
                    </View>

                    <View className="relative">
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#8A968B"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry={!showPassword}
                            className="bg-[#F4F7EF] px-4 py-4 pr-12 mb-3 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4"
                        >
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#66736B" />
                        </TouchableOpacity>
                        {errors.password ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                        ) : null}
                    </View>

                    <View className="relative">
                        <TextInput
                            placeholder="Confirm password"
                            placeholderTextColor="#8A968B"
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                            secureTextEntry={!showConfirmPassword}
                            className="bg-[#F4F7EF] mb-3 px-4 py-4 pr-12 rounded-xl border border-[#D7DFD1] text-[#101828] font-semibold"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-4"
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color="#66736B"
                            />
                        </TouchableOpacity>
                        {errors.confirmPassword ? (
                            <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                        ) : null}
                    </View>

                    <View className="flex-row items-center mt-4">
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            className="flex-row items-center"
                        >
                            <View
                                className={`w-5 h-5 border rounded mr-2 ${
                                    agreeToTerms ? 'bg-[#0B4D26] border-[#0B4D26]' : 'border-[#BFCABD]'
                                }`}
                            >
                                {agreeToTerms && <Ionicons name="checkmark" size={18} color="white" />}
                            </View>
                        </TouchableOpacity>
                        <Text className="text-sm text-[#66736B] font-medium">
                            I agree to the <Text className="text-[#0B4D26]">Terms</Text> and{' '}
                            <Text className="text-[#0B4D26]">Conditions</Text>
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleSignup} className="bg-[#0B4D26] p-4 rounded-xl mt-6">
                        <Text className="text-white text-center font-extrabold text-base">Sign up</Text>
                    </TouchableOpacity>

                    <View className="mt-8 space-y-4">
                        <Text className="text-center text-[#8A968B] font-semibold">or continue with</Text>

                        <TouchableOpacity className="flex-row items-center mb-4 justify-center space-x-2 border border-[#D7DFD1] bg-[#FAFBF7] p-4 rounded-xl">
                            <AntDesign name="google" size={24} color="#DB4437" />
                            <Text className="text-[#102418] font-bold ml-2">Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-center space-x-2 bg-[#EEF3FF] p-4 rounded-xl">
                            <AntDesign name="facebook" size={24} color="#4267B2" />
                            <Text className="text-[#102418] font-bold ml-2">Continue with Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-6 mb-8">
                        <Text className="text-[#66736B] font-medium">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signin')}>
                            <Text className="text-[#0B4D26] font-extrabold">Sign in</Text>
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

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-5">
                    <View className="bg-white rounded-2xl p-6 w-full border border-[#E2E8D8]">
                        <Text className="text-lg font-extrabold text-[#102418] text-center mb-4">Terms & Conditions</Text>
                        <Text className="text-sm text-[#66736B] text-center mb-4 leading-5">
                            Welcome to AgriSense. By using this app, you agree to our Terms & Conditions
                            and Privacy Policy. AgriSense helps farmers with soil analysis, weather
                            insights, crop recommendations, irrigation advice, and pest management.
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setAgreeToTerms(true);
                                setModalVisible(false);
                            }}
                            className="flex-row items-center justify-center bg-[#0B4D26] p-3 rounded-xl"
                        >
                            <Ionicons name="checkmark" size={16} color="white" />
                            <Text className="text-white font-semibold ml-2">I Agree & Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
