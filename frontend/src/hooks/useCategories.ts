
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/api.ts";
import type { Category } from "../types/index.ts";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });
}
