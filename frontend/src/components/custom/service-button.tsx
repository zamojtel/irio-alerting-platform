import { useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useDeleteService,
  useUpdateService,
  type MonitoredService,
} from "@/lib/api/service";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { ServiceForm } from "@/components/forms/service-form";

export const UpdateServiceButton = ({
  service,
}: {
  service: MonitoredService;
}) => {
  const { mutateAsync: updateService } = useUpdateService();

  const [open, setOpen] = useState(false);

  const handleSubmit = (data: Omit<MonitoredService, "id" | "status">) => {
    updateService({ ...data, id: service.id });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            Update the details of the service you want to monitor and receive
            alerts for.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5">
          <ServiceForm initialValues={service} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteServiceButton = ({
  serviceID,
}: {
  serviceID: MonitoredService["id"];
}) => {
  const router = useRouter();
  const { mutateAsync: deleteService } = useDeleteService();

  const handleDelete = async () => {
    await deleteService(serviceID);
    router.navigate({ to: "/services" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
