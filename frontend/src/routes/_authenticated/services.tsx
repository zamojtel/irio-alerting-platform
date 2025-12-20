import { ServiceList } from "@/components/custom/service-list";
import { Button } from "@/components/ui/button";
import {
  myServicesQuery,
  useCreateService,
  type MonitoredService,
} from "@/lib/api/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { CreateServiceForm } from "@/components/forms/create-service-form";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/_authenticated/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: createService } = useCreateService();
  const { data: services = [], isLoading } = useQuery(myServicesQuery);

  return (
    <section className="w-3/4">
      <div className="mt-20 flex flex-col gap-4">
        {isLoading ? (
          <Spinner className="mx-auto size-8" />
        ) : (
          <>
            <NewServiceDialog onSubmit={createService}>
              <Button className="hover:cursor-pointer w-35">
                <PlusCircle />
                Create new
              </Button>
            </NewServiceDialog>
            <ServiceList services={services} />
          </>
        )}
      </div>
    </section>
  );
}

const NewServiceDialog = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: Omit<MonitoredService, "id" | "status">) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New service</DialogTitle>
          <DialogDescription>
            Create a new service to monitor and receive alerts for.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5">
          <CreateServiceForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
