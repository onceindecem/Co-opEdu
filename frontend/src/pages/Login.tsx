import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "../api/services/authService";
import "./Login.css";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Please enter your email" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const role = searchParams.get("role");

    if (role) {
      if (role === "STUDENT") {
        navigate("/student", { replace: true });
      } else if (role === "ADVISOR") {
        navigate("/advisor", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [searchParams, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError("");
    setIsLoading(true);

    try {
      await authService.login({
        email: data.email,
        password: data.password,
      });

      const role = await checkAuth();
      if (role) {
        if (role === "STUDENT") {
          navigate("/student");
        } else if (role === "ADVISOR") {
          navigate("/advisor");
        } else if (role === "HR") {
          navigate("/company");
        } else if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        setApiError(
          "You have attempted to log in too many times. Please wait and try again later.",
        );
      } else {
        setApiError(
          error.response?.data?.message ||
            "email or password is incorrect, please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <h2>เข้าสู่ระบบ</h2>
          <p className="login-subtitle">
            ระบบบริหารจัดการสหกิจศึกษา (Co-op System)
          </p>
        </div>

        {apiError && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-field">
            <label>อีเมล</label>
            <input type="email" {...register("email")} disabled={isLoading} />
            {errors.email && (
              <span
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="input-field">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <span
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {errors.password.message}
              </span>
            )}
          </div>
          <button type="submit" className="btn-login">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="separator">
          <span>หรือเข้าสู่ระบบด้วย</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => {
              authService.loginWithGoogle();
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "25px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: "10px",
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              width="20"
            />
            Sign in with Google
          </button>
        </div>

        <div className="register-link">
          ยังไม่มีบัญชีบริษัทใช่ไหม? <a href="/register">ลงทะเบียนเลย</a>
        </div>
      </div>
    </div>
  );
}
