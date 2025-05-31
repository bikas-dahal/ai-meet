"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft, PanelLeftClose, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCommand } from "./command";

export const DashboardNavbar = () => {
  const { isMobile, toggleSidebar, state } = useSidebar();
  const [commandOpen, setCommandOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [commandOpen]);

  return (
    <>
      <DashboardCommand open={commandOpen} onOpenChange={setCommandOpen} />
      <nav className="flex items-center px-4 gap-x-2 border-b bg-background justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            variant={"outline"}
            className="size-9 cursor-pointer"
            onClick={toggleSidebar}
          >
            {isMobile || state === "collapsed" ? (
              <PanelLeft />
            ) : (
              <PanelLeftClose />
            )}
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            className="w-[240px] hover:bg-white cursor-pointer hover:text-muted-foreground h-9 justify-start font-normal text-muted-foreground"
            onClick={() => setCommandOpen(!commandOpen)}
          >
            <SearchIcon className="h-4 w-4" />
            Search
            <kbd className="ml-auto pointer-events-none border text-[10px] font-medium items-center inline-flex h-5 select-none gap-1 rounded-md bg-muted px-1.5 font-mono text-muted-foreground">
              <span className="text-xs">&#8984;</span> K
            </kbd>
          </Button>
        </div>
        {/* <div>
          <DashboardUserButton />
        </div> */}
      </nav>
    </>
  );
};
