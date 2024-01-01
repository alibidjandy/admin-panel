import Header from "../components/header";
import Login from "../components/login";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Header
          heading="Login to your account"
          // paragraph="Don't have an account yet? "
          // linkName="Signup"
          // linkUrl="/signup"
        />
        <Login />
      </div>
    </div>
  );
}
