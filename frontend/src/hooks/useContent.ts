import { useQuery } from "@tanstack/react-query";
import { contentApi } from "../services/api.ts";
import type { Content } from "../types/index.ts";

export function useContent() {
  return useQuery<Content[], Error>({
    queryKey: ["content"],
    queryFn: async () => {
      const response = await contentApi.getAll();
      // Handle the response structure from backend
      return Array.isArray(response) ? response : response.contents || [];
    },
  });
}
