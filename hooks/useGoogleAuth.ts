import { useCallback, useEffect, useRef, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import ENV from '@/config/env';
import { authApi } from '@/services/api';
import { useSidebar } from '@/context/SidebarContext';
import { isFarmerRole } from '@/utils/userDisplay';
import { getPostAuthRoute, persistAuthSession } from '@/utils/session';

WebBrowser.maybeCompleteAuthSession();

export type GoogleAuthFeedback = {
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
};

type Options = {
  onFeedback?: (feedback: GoogleAuthFeedback) => void;
};

/**
 * Google ID-token sign-in for Expo (Expo Go + web).
 * Posts the token to POST /api/auth/google/verify-token, then reuses the email-login session path.
 */
export function useGoogleAuth(options?: Options) {
  const router = useRouter();
  const { applyUser } = useSidebar();
  const [loading, setLoading] = useState(false);
  const clientId = ENV.GOOGLE_WEB_CLIENT_ID?.trim() || '';
  const onFeedbackRef = useRef(options?.onFeedback);

  useEffect(() => {
    onFeedbackRef.current = options?.onFeedback;
  }, [options?.onFeedback]);

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: clientId || undefined,
    webClientId: clientId || undefined,
    selectAccount: true,
  });

  const signInWithGoogle = useCallback(async () => {
    const notify = onFeedbackRef.current;

    if (!clientId) {
      notify?.({
        type: 'error',
        title: 'Google sign-in unavailable',
        message:
          'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set. Add your Google Web client ID to the app .env and restart Expo.',
      });
      return;
    }

    if (!request) {
      notify?.({
        type: 'info',
        title: 'Please wait',
        message: 'Google sign-in is still preparing. Try again in a moment.',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        if (result.type === 'error') {
          notify?.({
            type: 'error',
            title: 'Google sign-in failed',
            message: result.error?.message || 'Could not complete Google sign-in.',
          });
        }
        return;
      }

      const idToken =
        result.params?.id_token ||
        (result as { authentication?: { idToken?: string } }).authentication?.idToken;

      if (!idToken) {
        notify?.({
          type: 'error',
          title: 'Google sign-in failed',
          message: 'Google did not return an ID token. Check your OAuth client redirect URIs.',
        });
        return;
      }

      const data = await authApi.verifyGoogleToken(idToken);
      if (!data.access_token || !data.user) {
        notify?.({
          type: 'error',
          title: 'Google sign-in failed',
          message: data.message || 'No session was returned from the server.',
        });
        return;
      }

      if (!isFarmerRole(data.user.role)) {
        notify?.({
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
    } catch (error: any) {
      notify?.({
        type: 'error',
        title: 'Google sign-in failed',
        message: error?.message || 'Could not sign in with Google.',
      });
    } finally {
      setLoading(false);
    }
  }, [applyUser, clientId, promptAsync, request, router]);

  return {
    signInWithGoogle,
    loading,
    ready: !!clientId && !!request,
  };
}
