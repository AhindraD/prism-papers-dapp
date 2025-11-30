import { UserGuard } from "@/components/user-guard";

export default function Page() {
  return (
    <UserGuard>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Papers
        </h1>
      </div>
    </UserGuard>
  )
}
