import { UserButton, UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <UserButton />
      <div className="mt-8">
        <UserProfile />
      </div>
    </div>
  );
}
