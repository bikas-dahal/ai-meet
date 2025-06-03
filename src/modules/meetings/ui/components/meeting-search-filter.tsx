
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { Search } from "lucide-react";

export const MeetingSearchFilter = () => {

    const [filters, setFilters] = useMeetingsFilters();

    return (
        <div className="relative">
            <Input
                placeholder="Search meetings by name..."
                value={filters.search}
                className="h-9 bg-white w-[250px] "
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <Search className="absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> 
        </div>
    )
}