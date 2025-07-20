import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex items-center bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 justify-center min-h-screen">
      <SignIn
        signUpUrl="/sign-up"
        afterSignInUrl="/home"
        redirectUrl="/home"
      />
    </main>
  );
}
