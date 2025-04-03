
import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast.success("Successfully logged in");
    } else {
      toast.error("Invalid password");
    }
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900/40 transition-colors duration-300 dark:bg-opacity-50">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900/40 rounded-lg shadow-lg dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)] elevated-card border border-gray-100 dark:border-gray-800/50 transition-all duration-300">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 border-gray-200 dark:border-gray-700"
            />
          </div>
          <Button type="submit" className="w-full hover:bg-primary/90 transition-colors">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
