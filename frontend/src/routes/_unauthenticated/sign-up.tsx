import { SignupForm } from "@/components/forms/signup-form";
import { register, type RegisterDTO } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

export const Route = createFileRoute("/_unauthenticated/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const onSubmit = async (data: RegisterDTO) => {
    try {
      await register(data);

      toast.success("Successfully registered");

      router.navigate({ to: "/sign-in" });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-md pt-[10%]">
      <SignupForm onSubmit={onSubmit} />
    </div>
  );
}
