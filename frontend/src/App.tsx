import { Providers } from "@/providers";
import { SignupForm } from "@/components/signup-form";

function App() {
  return (
    <Providers>
      <div className="w-lg mx-auto mt-50">
        <SignupForm />
      </div>
    </Providers>
  );
}

export default App;
