import React from 'react';
import { Animated, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
}

export default function StatusModal({ visible, onClose, type, title, message }: StatusModalProps) {
    const scale = React.useRef(new Animated.Value(0.96)).current;

    React.useEffect(() => {
        if (visible) {
            scale.setValue(0.96);
            Animated.spring(scale, {
                toValue: 1,
                friction: 8,
                tension: 90,
                useNativeDriver: true,
            }).start();
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto-close after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [visible, onClose, scale]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'info': return 'information-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#0B4D26';
            case 'error': return '#D92D20';
            case 'info': return '#2563EB';
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContainer, { transform: [{ scale }] }]}>
                    <View style={styles.contentContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
                            <Ionicons name={getIcon()} size={34} color={getColor()} />
                        </View>

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: getColor() }]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 0,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
    },
    contentContainer: {
        padding: 28,
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#101828',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#667085',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
    },
});
