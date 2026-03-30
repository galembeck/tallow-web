import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userModule } from "@/api/http/routes/user";
import type { ProfileType } from "@/types/enums/profile-type";
import type { UpdateProfileData, User } from "@/types/services/user";

interface UseUserOptions {
  clientId?: string;
  adminId?: string;
  enableClientsQuery?: boolean;
  enableClientQuery?: boolean;
  enableAdminsQuery?: boolean;
  enableAdminQuery?: boolean;
}

export function useUser({
  clientId,
  adminId,
  enableClientsQuery = false,
  enableClientQuery = false,
  enableAdminsQuery = false,
  enableAdminQuery = false,
}: UseUserOptions = {}) {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery<User[]>({
    queryKey: ["users", "admin", "clients"],
    queryFn: () => userModule.getClients(),
    enabled: enableClientsQuery,
    retry: 1,
    staleTime: 0,
  });

  const clientQuery = useQuery<User>({
    queryKey: ["users", "admin", "clients", clientId],
    queryFn: () => userModule.getClientById(clientId!),
    enabled: enableClientQuery && !!clientId,
    retry: 1,
    staleTime: 0,
  });

  const adminsQuery = useQuery<User[]>({
    queryKey: ["users", "admin", "admins"],
    queryFn: () => userModule.getAdmins(),
    enabled: enableAdminsQuery,
    retry: 1,
    staleTime: 0,
  });

  const adminQuery = useQuery<User>({
    queryKey: ["users", "admin", "admins", adminId],
    queryFn: () => userModule.getAdminById(adminId!),
    enabled: enableAdminQuery && !!adminId,
    retry: 1,
    staleTime: 0,
  });

  const updateClientMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Pick<UpdateProfileData, "name" | "email">;
    }) => userModule.updateClient(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin", "clients"] });
      queryClient.setQueryData(["users", "admin", "clients", updated.id], updated);
    },
  });

  const updateProfileTypeMutation = useMutation({
    mutationFn: ({ id, profileType }: { id: string; profileType: ProfileType }) =>
      userModule.updateProfileType(id, profileType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userModule.updateProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData<User | null>(["auth", "user"], (old) => {
        if (!old) return updated;
        return { ...old, ...updated };
      });
    },
  });

  return {
    clients: clientsQuery.data ?? [],
    isClientsLoading: clientsQuery.isLoading,

    client: clientQuery.data,
    isClientLoading: clientQuery.isLoading,

    admins: adminsQuery.data ?? [],
    isAdminsLoading: adminsQuery.isLoading,

    admin: adminQuery.data,
    isAdminLoading: adminQuery.isLoading,

    updateClient: updateClientMutation.mutateAsync,
    isUpdatingClient: updateClientMutation.isPending,

    updateProfileType: updateProfileTypeMutation.mutateAsync,
    isUpdatingProfileType: updateProfileTypeMutation.isPending,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
