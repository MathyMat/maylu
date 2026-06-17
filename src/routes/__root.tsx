import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl">🐾</p>
        <h1 className="mt-2 font-display text-5xl font-bold text-cocoa">404</h1>
        <p className="mt-2 text-sm text-cocoa/70">
          Esta página se perdió como un cachorro travieso.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-butter px-5 py-2.5 font-display font-bold text-cocoa shadow hover:bg-honey"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-bold text-cocoa">Algo salió mal</h1>
        <p className="mt-2 text-sm text-cocoa/70">Intenta recargar la página.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-butter px-5 py-2.5 font-display font-bold text-cocoa"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ayuda a Maylu — Colecta para mi viringo peruano" },
      {
        name: "description",
        content:
          "Colecta para Maylu, viringo peruano de 13 años. Chocotejas, instalación de Office y donaciones para su endoscopia y operación.",
      },
      { property: "og:title", content: "Ayuda a Maylu 🐾" },
      {
        property: "og:description",
        content: "Mi niño Maylu necesita una endoscopia. Ayúdame a salvarlo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { padding: 0, background: "transparent", boxShadow: "none" },
        }}
      />
    </QueryClientProvider>
  );
}
