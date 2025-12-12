import { ThemeProvider } from "./Theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>;
};
