/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: handled by own files... */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authModule } from "@/api/http/routes/auth";
import { userModule } from "@/api/http/routes/user";
import { cookies } from "@/lib/cookies";

export function useAuth() {
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: userModule.register,
    onSuccess: () => {},
  });

  const loginMutation = useMutation({
    mutationFn: authModule.login,
    onSuccess: async (data) => {
      if (data?.accessToken) {
        cookies.set("AccessToken", data.accessToken, 7);
      }

      if (data?.refreshToken) {
        cookies.set("RefreshToken", data.refreshToken, 30);
      }

      await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  const logout = async () => {
    const token = cookies.get("AccessToken");

    if (token) {
      try {
        await authModule.logout(token);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        //
      }
    }

    cookies.remove("AccessToken");
    cookies.remove("RefreshToken");

    queryClient.setQueryData(["auth", "user"], null);
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const token = cookies.get("AccessToken");

      if (!token) {
        return null;
      }

      try {
        return await userModule.getMe(token);
      } catch (error) {
        if (error instanceof Error && error.message.includes("UNAUTHORIZED")) {
          cookies.remove("AccessToken");
          cookies.remove("RefreshToken");

          queryClient.setQueryData(["auth", "user"], null);
        }

        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const requestPasswordRecovery = useMutation({
    mutationFn: authModule.requestPasswordRecovery,
  });

  const verifyRecoveryToken = useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      authModule.verifyRecoveryToken(email, token),
  });

  const resetPassword = useMutation({
    mutationFn: ({
      email,
      token,
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    }) => authModule.resetPassword(email, token, newPassword),
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    logout,

    user,
    isLoading,
    isAuthenticated: !!user,

    requestPasswordRecovery: requestPasswordRecovery.mutateAsync,
    isRequestingRecovery: requestPasswordRecovery.isPending,

    verifyRecoveryToken: verifyRecoveryToken.mutateAsync,
    isVerifyingToken: verifyRecoveryToken.isPending,

    resetPassword: resetPassword.mutateAsync,
    isResettingPassword: resetPassword.isPending,
  };
}
