export type ServiceStatus = "UP" | "DOWN" | "UNKNOWN";

type Seconds = number & { __secondsBrand: never };
type Minutes = number & { __minutesBrand: never };

export type MonitoredService = {
  id: string;
  name: string;
  url: string;
  port: number;
  oncallers: string[];
  healthCheckInterval: Seconds;
  alertWindow: Seconds;
  allowedResponseTime: Minutes;
  status: ServiceStatus;
};

export const getDummyServices = (): MonitoredService[] => {
  return [
    {
      id: "1",
      name: "Service A",
      url: "http://service-a.example.com",
      port: 80,
      status: "UP",
      oncallers: ["Jane Doe", "John Smith"],
      healthCheckInterval: 60 as Seconds,
      alertWindow: 300 as Seconds,
      allowedResponseTime: 2 as Minutes,
    },
    {
      id: "2",
      name: "Service B",
      url: "http://service-b.example.com",
      port: 443,
      status: "DOWN",
      oncallers: ["Alice Johnson"],
      healthCheckInterval: 60 as Seconds,
      alertWindow: 300 as Seconds,
      allowedResponseTime: 2 as Minutes,
    },
    {
      id: "3",
      name: "Service C",
      url: "http://service-c.example.com",
      port: 8080,
      status: "UNKNOWN",
      oncallers: ["Bob Brown", "Charlie Davis"],
      healthCheckInterval: 60 as Seconds,
      alertWindow: 300 as Seconds,
      allowedResponseTime: 2 as Minutes,
    },
  ];
};
