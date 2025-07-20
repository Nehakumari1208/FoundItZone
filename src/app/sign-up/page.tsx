import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 items-center justify-center min-h-screen">
      <SignUp
        signInUrl="/sign-in"
        afterSignUpUrl="/home"
        redirectUrl="/home"
      />
    </main>
  );
}
