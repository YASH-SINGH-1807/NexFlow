import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/layouts/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import NFButton from "@/components/ui/NFButton";
import NFFormField from "@/components/ui/NFFormField";
import NFInput from "@/components/ui/NFInput";

import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/loginSchema";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const loginMutation = useLogin();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");

    try {
      const response = await loginMutation.mutateAsync(data);

      login(response.token);

      navigate("/");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          "Login failed"
      );
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Login to continue using NexFlow"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <NFFormField
            label="Email or Username"
            error={errors.login?.message}
          >
            <NFInput
              placeholder="Enter email or username"
              {...register("login")}
            />
          </NFFormField>

          <NFFormField
            label="Password"
            error={errors.password?.message}
          >
            <NFInput
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
          </NFFormField>

          {serverError && (
            <p className="text-center text-red-500 text-sm">
              {serverError}
            </p>
          )}

          <NFButton
            className="w-full"
            size="lg"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? "Signing In..."
              : "Login"}
          </NFButton>

          <p className="text-center text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}