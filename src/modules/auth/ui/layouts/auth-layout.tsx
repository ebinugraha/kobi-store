export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white min-h-svh flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-sm md:max-w-xl">{children}</div>
    </div>
  );
};
