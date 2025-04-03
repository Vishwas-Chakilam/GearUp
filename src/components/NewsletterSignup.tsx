
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing! Check your email to confirm.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md w-full mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/80 dark:bg-black/30 border-0 rounded-full py-6 px-5"
        required
      />
      <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 text-white whitespace-nowrap px-6">
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterSignup;
