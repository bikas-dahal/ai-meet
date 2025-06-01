import { DEFAULT_PAGE } from "@/constants";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

export const useAgentsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
      clearOnDefault: true,
    })
  });
};

