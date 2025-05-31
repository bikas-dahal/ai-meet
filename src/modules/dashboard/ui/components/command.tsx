import { CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command"
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}


export const DashboardCommand = ({ open, onOpenChange }: Props) => {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput 
             placeholder="Find a meeting or agent"
            />
            <CommandList>
                <CommandItem>
                    Rest
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}