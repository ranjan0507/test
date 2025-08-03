import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "../services/api.ts";
import type { Content } from "../types/index.ts";

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation<Content, Error, Partial<Content>>({
    mutationFn: (data: Partial<Content>) => contentApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useEditContent() {
  const qc = useQueryClient();
  return useMutation<Content, Error, { _id: string; data: Partial<Content> }>({
    mutationFn: ({ _id, data }) => contentApi.update(_id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => contentApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
