"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
    const router = useRouter()
  const { data } = authClient.useSession();
  if (!data?.user) {
    return (
      <div>loading...</div>
    );
  }

  return (
    <div>
      <h1>Home</h1>
      {data?.user ? (
        <div>
          <p>Hello {data.user.name}</p>
        </div>
      ) : (
        <div>
          <p>Please sign in</p>
        </div>
      )}
      <Button onClick={() => authClient.signOut({
        fetchOptions: {
            onSuccess: () => router.push("/sign-in")
        }
      })}>Sign out</Button>
    </div>
  );
}
