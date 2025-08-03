
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi} from "@/services/api.ts";
import type { Category } from "../types/index.ts";

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation<Category, Error, string>({
    mutationFn: (name: string) => categoriesApi.create(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
