import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { NotificationsProvider } from "@/contexts/notifications-context";

import { routeTree } from "./route-tree-gen";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<NotificationsProvider>
				<RouterProvider router={router} />
			</NotificationsProvider>
		</QueryClientProvider>
	);
}
