"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { SuccessModal } from "@/components/ui/success-modal";
import { registerSchema } from "@/lib/validation";
import { ZodError } from "zod";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};

    try {
      if (name === "email") {
        const emailSchema = registerSchema.shape.email;
        emailSchema.parse(value);
      } else if (name === "password") {
        const passwordSchema = registerSchema.shape.password;
        passwordSchema.parse(value);
      } else if (name === "confirmPassword") {
        if (form.password && value !== form.password) {
          errors[name] = "Passwords do not match";
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.issues[0];
        errors[name] = fieldError?.message || "Invalid input";
      }
    }

    return errors;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const errors = validateField(name, value);
    if (errors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: errors[name],
      }));
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const errors = validateField(name, value);
      if (errors[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: errors[name],
        }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    }
  };

  const isFormValid = () => {
    try {
      registerSchema.parse(form);
      return true;
    } catch {
      return false;
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const validation = registerSchema.safeParse(form);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(errors).forEach(([key, msgs]) => {
        newErrors[key] = msgs?.[0] || "Invalid input";
      });
      setFieldErrors(newErrors);
      toast.error("Please fix the errors above");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");

        if (data.error?.includes("already registered")) {
          setFieldErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        }
        return;
      }

      toast.success("Account created successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-900 px-4 py-8">
      {showSuccess && (
        <SuccessModal
          title="Account Created!"
          message="Your KodBank account is ready. Redirecting to login..."
          autoRedirectTo="/login"
          autoRedirectDelay={2500}
        />
      )}

      <section className="w-full max-w-md rounded-2xl bg-dark-800 p-8 shadow-lg ring-1 ring-dark-700">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Open your KodBank account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Create a secure account with strong password requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <FloatingLabelInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? fieldErrors.email : undefined}
              isValid={touched.email && !fieldErrors.email && form.email !== ""}
              disabled={loading}
            />
          </div>

          <div>
            <FloatingLabelInput
              label="Full name (optional)"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <FloatingLabelInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? fieldErrors.password : undefined}
              showPasswordToggle
              disabled={loading}
            />
            <PasswordStrengthMeter password={form.password} />
          </div>

          <div>
            <FloatingLabelInput
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? fieldErrors.confirmPassword : undefined}
              isValid={
                touched.confirmPassword &&
                !fieldErrors.confirmPassword &&
                form.confirmPassword !== "" &&
                form.password === form.confirmPassword
              }
              showPasswordToggle
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin">⏳</span>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary transition-colors hover:text-primary-light"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}


