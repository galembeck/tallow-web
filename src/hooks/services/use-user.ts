import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userModule } from "@/api/http/routes/user";
import type { ProfileType } from "@/types/enums/profile-type";
import type {
  RegisterAddressData,
  UpdateAddressData,
  UpdateProfileData,
  User,
  UserAddress,
} from "@/types/services/user";

interface UseUserOptions {
  clientId?: string;
  adminId?: string;
  addressId?: string;
  enableClientsQuery?: boolean;
  enableClientQuery?: boolean;
  enableAdminsQuery?: boolean;
  enableAdminQuery?: boolean;
  enableAddressesQuery?: boolean;
  enableAddressQuery?: boolean;
}

export function useUser({
  clientId,
  adminId,
  addressId,
  enableClientsQuery = false,
  enableClientQuery = false,
  enableAdminsQuery = false,
  enableAdminQuery = false,
  enableAddressesQuery = false,
  enableAddressQuery = false,
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
      queryClient.invalidateQueries({
        queryKey: ["users", "admin", "clients"],
      });
      queryClient.setQueryData(
        ["users", "admin", "clients", updated.id],
        updated,
      );
    },
  });

  const updateProfileTypeMutation = useMutation({
    mutationFn: ({
      id,
      profileType,
    }: {
      id: string;
      profileType: ProfileType;
    }) => userModule.updateProfileType(id, profileType),
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

  const registerAddressMutation = useMutation({
    mutationFn: (data: RegisterAddressData) => userModule.registerAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "addresses"] });
    },
  });

  const addressesQuery = useQuery<UserAddress[]>({
    queryKey: ["user", "addresses"],
    queryFn: () => userModule.getUserAddresses(),
    enabled: enableAddressesQuery,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const addressQuery = useQuery<UserAddress>({
    queryKey: ["user", "addresses", addressId],
    queryFn: () => userModule.getAddressById(addressId!),
    enabled: enableAddressQuery && !!addressId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const updateAddressMutation = useMutation({
    mutationFn: (data: UpdateAddressData) =>
      userModule.updateAddress(addressId!, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<UserAddress | null>(
        ["user", "addresses", addressId],
        (old) => {
          if (!old) return updated;
          return { ...old, ...updated };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["user", "addresses"] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => userModule.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "addresses"] });
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

    registerAddress: registerAddressMutation.mutateAsync,
    isRegisteringAddress: registerAddressMutation.isPending,

    addresses: addressesQuery.data ?? [],
    isAddressesLoading: addressesQuery.isLoading,

    address: addressQuery.data,
    isAddressLoading: addressQuery.isLoading,

    updateAddress: updateAddressMutation.mutateAsync,
    isUpdatingAddress: updateAddressMutation.isPending,

    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
}
