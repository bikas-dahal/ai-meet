import { trpc } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const [agentSearch, setAgentSearch] = useState("");
  const { data } = trpc.agents.getMany.useQuery({
    pageSize: 100,
    search: agentSearch,
  });

  return (
    <CommandSelect
      className="h-9"
      placeholder="Select an agent"
      options={
        (data?.items ?? []).map((agent) => ({
          value: agent.id,
          id: agent.id,
          children: ( 
            <div className="flex items-center gap-x-2">
              <GeneratedAvatar
                seed={agent.name}
                className="size-5"
                variant="botttsNeutral"
              />
              <span>{agent.name}</span>
            </div>
          ),
        })) || []
      }
      onSelect={(value) => setFilters({ agentId: value })}
      value={filters.agentId}
      isSearchable
      onSearch={setAgentSearch}
    />
  );
};
