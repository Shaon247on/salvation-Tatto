import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Animated circles */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/20 rounded-full animate-pulse"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-primary/10 rounded-full animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
        {/* Large 404 number */}
        <div className="relative">
          <span className="text-[150px] md:text-[200px] font-bold text-primary/20 select-none tracking-tighter">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold text-foreground">
              Oops!
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&lsquo;s get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
