import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authModule } from "@/api/http/routes/auth";
import { userModule } from "@/api/http/routes/user";
import { cookies } from "@/lib/cookies";

export function useAuth() {
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: userModule.register,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: handled by SignUpForm
    onSuccess: () => {},
  });

  const loginMutation = useMutation({
    mutationFn: authModule.login,
    onSuccess: (data) => {
      if (data?.accessToken) {
        cookies.set("AccessToken", data.accessToken, 7);
      }

      if (data?.refreshToken) {
        cookies.set("RefreshToken", data.refreshToken, 30);
      }

      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

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
        }

        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
