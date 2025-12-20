import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { CacheKeys } from "./cache";
import { toast } from "sonner";
import { extractErrorMessage } from "../utils";

export type ServiceStatus = "UP" | "DOWN" | "UNKNOWN";

export type Seconds = number & { __secondsBrand: never };
export type Minutes = number & { __minutesBrand: never };

export type MonitoredService = {
  id: string;
  name: string;
  url: string;
  port: number;
  firstOncallerEmail: string;
  secondOncallerEmail?: string;
  healthCheckInterval: Seconds;
  alertWindow: Seconds;
  allowedResponseTime: Minutes;
  status: ServiceStatus;
};

export const myServicesQuery = queryOptions({
  queryKey: [CacheKeys.MyServices],
  queryFn: async () => {
    return axios
      .get<MonitoredService[]>("/services/me")
      .then((res) => res.data);
  },
  staleTime: 1000 * 60 * 5,
});

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<MonitoredService, "id" | "status">) => {
      return axios
        .post<{ service_id: number }>("/services/", service)
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CacheKeys.MyServices] });
      toast.success("Service created successfully");
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
      console.error("Error creating service:", err);
    },
  });
};
