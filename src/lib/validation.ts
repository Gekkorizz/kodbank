import { z } from "zod";

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Must contain at least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character (!@#$%^&* etc)"
  );

export const emailSchema = z.string().email("Invalid email address").toLowerCase();

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    fullName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Calculate password strength based on criteria
 */
export function getPasswordStrength(password: string): {
  level: "weak" | "fair" | "strong";
  percentage: number;
  message: string;
} {
  let strength = 0;
  const criteria = [];

  if (password.length >= 8) {
    strength += 20;
    criteria.push("✓ At least 8 characters");
  } else {
    criteria.push("✗ Needs 8+ characters");
  }

  if (/[a-z]/.test(password)) {
    strength += 20;
    criteria.push("✓ Lowercase letter");
  } else {
    criteria.push("✗ Needs lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    strength += 20;
    criteria.push("✓ Uppercase letter");
  } else {
    criteria.push("✗ Needs uppercase letter");
  }

  if (/[0-9]/.test(password)) {
    strength += 20;
    criteria.push("✓ Number");
  } else {
    criteria.push("✗ Needs number");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strength += 20;
    criteria.push("✓ Special character");
  } else {
    criteria.push("✗ Needs special character");
  }

  let level: "weak" | "fair" | "strong" = "weak";
  let message = "Weak password";

  if (strength >= 80) {
    level = "strong";
    message = "Strong password";
  } else if (strength >= 60) {
    level = "fair";
    message = "Fair password - add more variety";
  }

  return { level, percentage: strength, message };
}
