import "./Register.css";
import {
  UserPlus,
  User,
  Phone,
  Briefcase,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
} from "lucide-react";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/authService";

const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: z.string().min(9, { message: "Invalid phone number" }),
    position: z.string().min(1, { message: "Position is required" }),
    email: z.email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(15, { message: "Password must be at least 15 characters" })
      .max(128, { message: "password is too long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    companyNameTH: z
      .string()
      .min(1, { message: "Please enter the company name" }),
    companyNameEN: z.string().optional(),
    companyAddress: z
      .string()
      .min(1, { message: "Please enter the company address" }),
    companyEmail: z.email({ message: "Invalid company email format" }),
    companyPhone: z
      .string()
      .min(9, { message: "Invalid company phone number" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

async function checkPwnedPassword(password: string): Promise<boolean> {
  try {
    // convert password to SHA-1
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    // first 5 letters
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    // send api (only prefix)
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    const text = await response.text();

    // check suffix
    return text.includes(suffix);
  } catch (error) {
    console.error("Pwned check error", error);
    return false; 
  }
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password") || "";
  const passwordStrength = zxcvbn(passwordValue).score;
  const strengthColors = [
    "#ff4d4d",
    "#ff9e42",
    "#f3d331",
    "#92d050",
    "#00b050",
  ];
  const strengthLabels = [
    "very weak",
    "weak",
    "medium",
    "strong",
    "very strong",
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Check Password against Breach
      const isPwned = await checkPwnedPassword(data.password);
      if (isPwned) {
        alert("This password has been breached. Please change your password for security reasons.");
        return; 
      }

      await authService.registerHR({
        email: data.email,
        password: data.password,
        hrFirstName: data.firstName,
        hrLastName: data.lastName,
        hrPosition: data.position,
        hrTel: data.phone,
        coNameTH: data.companyNameTH,
        coNameEN: data.companyNameEN,
        coEmail: data.companyEmail,
        coTel: data.companyPhone,
        coAddr: data.companyAddress,
      });

      alert("Registration Successful!");
      navigate("/login");
    } catch (error: any) {
      alert(
        "An error occur " + (error.response?.data?.message || "Please try again"),
      );
    }
  };

  return (
    <div className="reg-screen">
      <div className="reg-card">
        <div className="reg-header">
          <UserPlus size={40} />
          <h2>ลงทะเบียนบริษัทใหม่</h2>
        </div>

        <form className="reg-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section-title">
            <User size={20} /> ข้อมูลผู้ใช้งาน / ผู้ประสานงาน
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>ชื่อ (First Name)</label>
              <input type="text" {...register("firstName")} />
              {errors.firstName && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="input-group">
              <label>นามสกุล (Last Name)</label>
              <input type="text" {...register("lastName")} />
              {errors.lastName && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Phone size={14} /> เบอร์โทรศัพท์ส่วนตัว (Tel.)
              </label>
              <input
                type="tel"
                maxLength={10}
                {...register("phone", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                })}
              />
              {errors.phone && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className="input-group">
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Briefcase size={14} /> ตำแหน่ง (Position)
              </label>
              <input type="text" {...register("position")} />
              {errors.position && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.position.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-section-title">
            <ShieldCheck size={20} /> ข้อมูลการเข้าสู่ระบบ
          </div>

          <div className="input-group span-full">
            <label>อีเมล (Email)</label>
            <input type="email" {...register("email")} />
            {errors.email && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>รหัสผ่าน (Password)</label>
              <input type="password" {...register("password")} />
              {passwordValue.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", height: "6px" }}>
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          backgroundColor:
                            index < passwordStrength
                              ? strengthColors[passwordStrength]
                              : "#e2e8f0",
                          borderRadius: "4px",
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: strengthColors[passwordStrength],
                    }}
                  >
                    Strength: {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
              {errors.password && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="input-group">
              <label>ยืนยันรหัสผ่าน (Confirm Password)</label>
              <input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <div className="form-section-title">
            <Building2 size={20} /> ข้อมูลสถานประกอบการ
          </div>

          <div className="input-group span-full">
            <label>ชื่อบริษัท (ภาษาไทย)</label>
            <span
              style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.75rem" }}
            >
              (Company Name in Thai)
            </span>
            <input type="text" {...register("companyNameTH")} maxLength={100} />
            {errors.companyNameTH && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.companyNameTH.message}
              </span>
            )}
          </div>

          <div className="input-group span-full">
            <label>
              ชื่อบริษัท (ภาษาอังกฤษ)
              <span className="optional-text"> (ถ้ามี)</span>
            </label>
            <span
              style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.75rem" }}
            >
              (Company Name in English)
            </span>
            <input type="text" {...register("companyNameEN")} maxLength={100} />
            {errors.companyNameEN && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.companyNameEN.message}
              </span>
            )}
          </div>

          <div className="input-group span-full">
            <label
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <MapPin size={16} /> ที่อยู่บริษัท (Company address)
            </label>
            <textarea rows={3} {...register("companyAddress")} />
            {errors.companyAddress && (
              <span
                style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.companyAddress.message}
              </span>
            )}
          </div>
          <div className="input-row">
            <div className="input-group">
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Mail size={16} /> อีเมลบริษัท (Company Email)
              </label>
              <input type="email" {...register("companyEmail")} />
              {errors.companyEmail && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.companyEmail.message}
                </span>
              )}
            </div>
            <div className="input-group">
              <label
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Phone size={16} /> เบอร์โทรบริษัท (Company Tel.)
              </label>
              <input
                type="tel"
                maxLength={10}
                {...register("companyPhone", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                })}
              />
              {errors.companyPhone && (
                <span
                  style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                >
                  {errors.companyPhone.message}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="btn-reg" disabled={isSubmitting}>
            {isSubmitting ? "กำลังสมัคร..." : "ยืนยันการลงทะเบียน"}
          </button>

          <div className="back-to-login">
            มีบัญชีบริษัทอยู่แล้ว? <a href="/login">กลับไปหน้าเข้าสู่ระบบ</a>
          </div>
        </form>
      </div>
    </div>
  );
}
