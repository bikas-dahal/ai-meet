import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronUp, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
  const { data, isPending } = authClient.useSession();
  const isMobile = useIsMobile();

  const router = useRouter();
  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  if (isPending || !data?.user) return null;

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/20 overflow-hidden">
          {data.user?.image ? (
            <Avatar>
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name}
              variant="initials"
              className="size-8 mr-2"
            />
          )}
          <div className="flex flex-col gap-1 ml-2 text-left min-w-0 overflow-hidden flex-1">
            <span className="text-sm font-medium truncate">
              {data.user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
          <ChevronUp className="h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
            <DrawerFooter >
              <Button variant={"outline"}>
                <CreditCard className="h-4 w-4 text-black" />
                Billing
              </Button>
              <Button variant={"outline"} onClick={onLogout}>
                <LogOut className="h-4 w-4 text-black" />
                Logout
              </Button>
            </DrawerFooter>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/20 overflow-hidden">
        {data.user?.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-8 mr-2"
          />
        )}
        <div className="flex flex-col gap-1 ml-2 text-left min-w-0 overflow-hidden flex-1">
          <span className="text-sm font-medium truncate">{data.user.name}</span>
          <span className="text-xs text-muted-foreground truncate">
            {data.user.email}
          </span>
        </div>
        <ChevronUp className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium truncate">
              {data.user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex p-2 cursor-pointer items-center gap-2">
          Billing <CreditCard className="h-4 w-4 text-black" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex p-2 cursor-pointer items-center gap-2"
          onClick={onLogout}
        >
          Logout <LogOut className="h-4 w-4 text-black" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
