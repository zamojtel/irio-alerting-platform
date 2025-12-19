import { ServiceList } from "@/components/custom/service-list";
import { Button } from "@/components/ui/button";
import { getDummyServices } from "@/lib/fetchers/service";
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

export const Route = createFileRoute("/_authenticated/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const services = getDummyServices();

  return (
    <section className="w-3/4">
      <div className="mt-20 flex flex-col gap-4">
        <NewServiceDialog>
          <Button className="hover:cursor-pointer w-35">
            <PlusCircle />
            Create new
          </Button>
        </NewServiceDialog>
        <ServiceList services={services} />
      </div>
    </section>
  );
}

const NewServiceDialog = ({ children }: { children: React.ReactNode }) => {
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
          <CreateServiceForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
