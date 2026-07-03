import AuthLayout from "@/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import NFButton from "@/components/ui/NFButton";
import NFFormField from "@/components/ui/NFFormField";
import NFInput from "@/components/ui/NFInput";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Create your NexFlow account"
      >
        <form className="space-y-6">
          <NFFormField label="Full Name">
            <NFInput placeholder="Enter your full name" />
          </NFFormField>

          <NFFormField label="Username">
            <NFInput placeholder="Choose a username" />
          </NFFormField>

          <NFFormField label="Email">
            <NFInput
              type="email"
              placeholder="Enter your email"
            />
          </NFFormField>

          <NFFormField label="Password">
            <NFInput
              type="password"
              placeholder="Create a password"
            />
          </NFFormField>

          <NFButton
            className="w-full"
            size="lg"
          >
            Create Account
          </NFButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}