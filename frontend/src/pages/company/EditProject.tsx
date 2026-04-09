import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 🌟 import jwt-decode
import "./Company.css";
import {
  ClipboardList,
  Users,
  Wrench,
  MapPin,
  Upload,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  Info,
  Building2,
  UserCircle,
  UserCheck,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "../../api/services/projectService";
import { useAuth } from "../../context/AuthContext";

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  // 🌟 เพิ่ม State สำหรับเก็บ ID จาก Token
  const { user, profile } = useAuth();

  // 🌟 เปลี่ยน Company Data ให้เป็น State แทน Mockup
  const [companyData, setCompanyData] = useState({
    nameTh: "",
    nameEn: "",
    address: "",
    phone: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    projNameTH: "",
    projDetail: "",
    projAmount: 1,
    jobDescription: "",
    skills: "",
    workLocation: "",
  });

  const [contactMethod, setContactMethod] = useState<"manager" | "coordinator">(
    "manager",
  );

  const [mentors, setMentors] = useState([
    { id: Date.now(), name: "", position: "", phone: "", email: "" },
  ]);

  const [pmData, setPmData] = useState({
    name: "",
    position: "",
    department: "",
    phone: "",
    email: "",
  });

  const [coordData, setCoordData] = useState({
    name: "",
    position: "",
    department: "",
    phone: "",
    email: "",
  });

  const [currentPmID, setCurrentPmID] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // 🌟 รวมการดึงข้อมูลจาก Token, ดึง Company, และดึงข้อมูล Project เก่าไว้ใน useEffect เดียวกัน
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. set company จาก profile
        if (profile) {
          setCompanyData({
            nameTh: profile.company.coNameTH || "ไม่ระบุชื่อบริษัท",
            nameEn: profile.company.coNameEN || "-",
            address: profile.company.coAddr || "-",
            phone: profile.company.coTel || "-",
            email: profile.company.coEmail || "-",
          });
        }

        // 2. โหลด project (edit mode)
        if (isEdit && id) {
          setLoading(true);

          const res = await projectService.getById(id);
          const data = res.data;

          setFormData({
            projNameTH: data.projName || "",
            projDetail: data.obj || "",
            projAmount: data.quota || 1,
            jobDescription: data.jd || "",
            skills: data.skills || "",
            workLocation: data.workAddr || "",
          });

          if (data.contact === "COORD" && data.contDetail) {
            setContactMethod("coordinator");
            setCoordData(JSON.parse(data.contDetail));
          } else {
            setContactMethod("manager");
          }

          if (data.mentor) {
            try {
              setMentors(JSON.parse(data.mentor));
            } catch (e) {
              console.error("Parse mentor error", e);
            }
          }

          if (data.projectManager) {
            setCurrentPmID(data.projectManager.pmID || data.pmID || "");
            setPmData({
              name: data.projectManager.pmName || "",
              position: data.projectManager.pmPos || "",
              department: data.projectManager.pmDept || "",
              phone: data.projectManager.pmTel || "",
              email: data.projectManager.pmEmail || "",
            });
          }
        }
      } catch (error) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", error);
        if (isEdit) {
          alert("ไม่พบข้อมูลโครงการนี้");
          navigate("/company/projects");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEdit, profile, navigate]);

  const handleAddMentor = () => {
    setMentors([
      ...mentors,
      { id: Date.now(), name: "", position: "", phone: "", email: "" },
    ]);
  };

  const handleRemoveMentor = (mentorId: number) => {
    if (mentors.length > 1) {
      setMentors(mentors.filter((mentor) => mentor.id !== mentorId));
    }
  };

  const handleMentorChange = (
    mentorId: number,
    field: string,
    value: string,
  ) => {
    setMentors(
      mentors.map((mentor) =>
        mentor.id === mentorId ? { ...mentor, [field]: value } : mentor,
      ),
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPmData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("projName", formData.projNameTH);
      data.append("obj", formData.projDetail);
      data.append("quota", String(formData.projAmount));
      data.append("jd", formData.jobDescription);
      data.append("skills", formData.skills);
      data.append("workAddr", formData.workLocation || companyData.address);
      data.append("contact", contactMethod === "manager" ? "PM" : "COORD");
      data.append(
        "contDetail",
        contactMethod === "coordinator" ? JSON.stringify(coordData) : "",
      );
      data.append("mentor", JSON.stringify(mentors));
      data.append("projStat", "PENDING");

      data.append(
        "pmData",
        JSON.stringify({
          pmID: currentPmID || null,
          pmName: pmData.name,
          pmPos: pmData.position,
          pmDept: pmData.department,
          pmTel: pmData.phone,
          pmEmail: pmData.email,
        }),
      );

      // 🌟 ใช้ตัวแปร State ที่แกะมาจาก Token ส่งไปแทน Hardcode
      data.append("coID", profile.coID);
      data.append("userID", user.userID);

      selectedFiles.forEach((file) => {
        data.append("files", file);
      });

      await projectService.update(id!, data);

      alert("บันทึกการแก้ไขเรียบร้อย!");
      navigate("/company/projects");
    } catch (error: any) {
      console.error("Submit Error:", error);
      alert(
        "เกิดข้อผิดพลาดในการบันทึก: " +
          (error.response?.data?.message || "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-page-container">
      <div className="page-header">
        <button type="button" onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} /> กลับ
        </button>
        <h1 className="page-title">
          {isEdit
            ? "แก้ไขโครงการ"
            : "แบบฟอร์มเสนอโครงการสหกิจศึกษา หลักสูตรวิทยาการคอมพิวเตอร์"}
        </h1>
      </div>

      <div className="card form-card">
        {isEdit && (
          <div className="alert-info">
            <Info size={16} /> <strong>หมายเหตุ:</strong>{" "}
            การแก้ไขข้อมูลจะทำให้สถานะกลับเป็น <strong>PENDING</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section-title">
            <Building2 size={20} /> ข้อมูลสถานประกอบการ/หน่วยงาน
          </div>
          <p className="section-subtitle">
            ดึงข้อมูลจากฐานข้อมูลขององค์กร (ไม่สามารถแก้ไขในหน้านี้ได้)
          </p>

          <div className="input-row">
            <div className="form-group">
              <label>ชื่อสถานประกอบการ/หน่วยงาน (ภาษาไทย)</label>
              <input
                type="text"
                value={companyData.nameTh}
                readOnly
                className="input-readonly"
              />
            </div>
            <div className="form-group">
              <label>ชื่อสถานประกอบการ/หน่วยงาน (ภาษาอังกฤษ)</label>
              <input
                type="text"
                value={companyData.nameEn}
                readOnly
                className="input-readonly"
              />
            </div>
          </div>

          <div className="form-group span-full">
            <label>ที่อยู่</label>
            <textarea
              rows={2}
              value={companyData.address}
              readOnly
              className="input-readonly"
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={companyData.phone}
                readOnly
                className="input-readonly"
              />
            </div>
            <div className="form-group">
              <label>อีเมล</label>
              <input
                type="email"
                value={companyData.email}
                readOnly
                className="input-readonly"
              />
            </div>
          </div>

          <div className="form-section-title mt-40">
            <UserCircle size={20} />{" "}
            ข้อมูลผู้จัดการโครงการ/หัวหน้าหน่วยงาน/ผู้จัดการ
          </div>

          <div className="form-group span-full">
            <label>ชื่อ-นามสกุล *</label>
            <input
              type="text"
              name="name"
              value={pmData.name}
              onChange={handlePmChange}
              placeholder="ระบุชื่อ-นามสกุล ผู้จัดการโครงการ"
              required
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>ตำแหน่ง *</label>
              <input
                type="text"
                name="position"
                value={pmData.position}
                onChange={handlePmChange}
                placeholder="เช่น Project Manager, CTO"
                required
              />
            </div>
            <div className="form-group">
              <label>แผนก/ฝ่าย *</label>
              <input
                type="text"
                name="department"
                value={pmData.department}
                onChange={handlePmChange}
                placeholder="เช่น Software Development"
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>เบอร์โทรศัพท์ติดต่อ *</label>
              <input
                type="tel"
                name="phone"
                value={pmData.phone}
                onChange={handlePmChange}
                placeholder="08xxxxxxxx"
                maxLength={10}
                pattern="[0-9]*"
                required
              />
            </div>
            <div className="form-group">
              <label>อีเมลติดต่อ *</label>
              <input
                type="email"
                name="email"
                value={pmData.email}
                onChange={handlePmChange}
                placeholder="manager@company.com"
                required
              />
            </div>
          </div>

          <div className="form-section-title mt-40">
            <ClipboardList size={20} /> รายละเอียดโครงการที่เสนอ
          </div>

          <div className="form-group span-full">
            <label>ชื่อโครงการ*</label>
            <input
              type="text"
              name="projNameTH"
              value={formData.projNameTH}
              onChange={handleChange}
              placeholder="เช่น Web Application for Inventory Management"
              required
            />
          </div>

          <div className="form-group span-full">
            <label>วัตถุประสงค์ของโครงการ *</label>
            <textarea
              rows={3}
              name="projDetail"
              value={formData.projDetail}
              onChange={handleChange}
              placeholder="ระบุสิ่งที่บริษัทต้องการได้รับจากโครงการนี้..."
              required
            />
          </div>

          <div className="form-group span-full">
            <label className="label-with-icon">
              <Users size={16} /> จำนวนนักศึกษาที่รับ (คน) *
            </label>
            <input
              type="number"
              name="projAmount"
              min="1"
              value={formData.projAmount}
              onChange={handleChange}
              placeholder="1"
              required
              className="input-half"
            />
          </div>

          <div className="form-group span-full">
            <label>ลักษณะงานที่ต้องปฏิบัติ (Job Description) *</label>
            <textarea
              rows={5}
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="ระบุรายละเอียดหน้าที่ความรับผิดชอบของนักศึกษา..."
              required
            />
          </div>

          <div className="form-group span-full">
            <label className="label-with-icon">
              <Wrench size={16} /> เครื่องมือและทักษะที่ต้องใช้ (Skills) *
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="เช่น React, Node.js, SQL, Docker"
              required
            />
          </div>

          <div className="form-section-header-flex mt-40">
            <div className="section-title-icon-wrapper">
              <UserCheck size={20} /> ข้อมูลพนักงานที่ปรึกษา (พี่เลี้ยง)
            </div>
            <button
              type="button"
              onClick={handleAddMentor}
              className="btn-add-mentor"
            >
              <Plus size={16} /> เพิ่มพี่เลี้ยง
            </button>
          </div>
          <p className="section-subtitle">
            ทำหน้าที่ดูแลและแนะนำในการปฏิบัติงานตลอดระยะเวลาโครงการ
            (สามารถเพิ่มได้มากกว่า 1 คน)
          </p>

          {mentors.map((mentor, index) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-card-header">
                <h4 className="mentor-card-title">คนที่ {index + 1}</h4>
                {mentors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMentor(mentor.id)}
                    className="btn-remove-mentor"
                  >
                    <Trash2 size={16} /> ลบ
                  </button>
                )}
              </div>

              <div className="input-row">
                <div className="form-group">
                  <label>ชื่อ-นามสกุล พี่เลี้ยง *</label>
                  <input
                    type="text"
                    placeholder="ระบุชื่อผู้ดูแล"
                    value={mentor.name}
                    onChange={(e) =>
                      handleMentorChange(mentor.id, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ตำแหน่งงานพี่เลี้ยง *</label>
                  <input
                    type="text"
                    placeholder="Senior Developer / Manager"
                    value={mentor.position}
                    onChange={(e) =>
                      handleMentorChange(mentor.id, "position", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="form-group">
                  <label className="label-with-icon">
                    <Phone size={14} /> เบอร์โทรศัพท์ติดต่อ *
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxx"
                    maxLength={10}
                    pattern="[0-9]*"
                    value={mentor.phone}
                    onChange={(e) =>
                      handleMentorChange(mentor.id, "phone", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label-with-icon">
                    <Mail size={14} /> อีเมลติดต่อ *
                  </label>
                  <input
                    type="email"
                    placeholder="mentor@company.com"
                    value={mentor.email}
                    onChange={(e) =>
                      handleMentorChange(mentor.id, "email", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="form-section-title mt-40">
            <Phone size={20} /> การติดต่อประสานงาน
          </div>

          <div className="form-group span-full">
            <label>
              หากมหาวิทยาลัยฯ
              ประสงค์จะติดต่อประสานงานในรายละเอียดกับสถานประกอบการ/หน่วยงาน
              ขอให้ติดต่อที่ใคร *
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="contactMethod"
                  value="manager"
                  checked={contactMethod === "manager"}
                  onChange={() => setContactMethod("manager")}
                  className="radio-input"
                />
                1. ติดต่อโดยตรงกับผู้จัดการโครงการ/หัวหน้าหน่วยงาน/ผู้จัดการ
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="contactMethod"
                  value="coordinator"
                  checked={contactMethod === "coordinator"}
                  onChange={() => setContactMethod("coordinator")}
                  className="radio-input"
                />
                2. ติดต่อกับบุคคลที่ สถานประกอบการ/หน่วยงาน มอบหมายต่อไปนี้
              </label>
            </div>
          </div>

          {contactMethod === "coordinator" && (
            <div className="coordinator-card">
              <h4 className="coordinator-title">
                รายละเอียดผู้ประสานงานของสถานประกอบการ/หน่วยงาน
              </h4>
              <div className="form-group span-full">
                <label>ชื่อ-นามสกุล ผู้ประสานงาน *</label>
                <input
                  type="text"
                  name="name"
                  value={coordData.name}
                  onChange={handleCoordChange}
                  placeholder="ระบุชื่อ-นามสกุล ผู้ประสานงาน (เช่น HR)"
                  required
                />
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>ตำแหน่ง *</label>
                  <input
                    type="text"
                    name="position"
                    value={coordData.position}
                    onChange={handleCoordChange}
                    placeholder="เช่น HR Manager, Recruiter"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>แผนก/ฝ่าย *</label>
                  <input
                    type="text"
                    name="department"
                    value={coordData.department}
                    onChange={handleCoordChange}
                    placeholder="เช่น Human Resources"
                    required
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ติดต่อ *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={coordData.phone}
                    onChange={handleCoordChange}
                    placeholder="08xxxxxxxx"
                    maxLength={10}
                    pattern="[0-9]*"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>อีเมลติดต่อ *</label>
                  <input
                    type="email"
                    name="email"
                    value={coordData.email}
                    onChange={handleCoordChange}
                    placeholder="hr@company.com"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-section-title mt-40">
            <MapPin size={20} /> สถานที่ปฏิบัติงาน
          </div>
          <div className="form-group span-full">
            <label>
              ระบุสถานที่ปฏิบัติงาน (หากต่างจากที่อยู่บริษัทที่ลงทะเบียนไว้)
            </label>
            <textarea
              rows={2}
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              placeholder="เลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ..."
            />
          </div>

          <div className="note-info-box">
            <strong>*หมายเหตุ:</strong>{" "}
            รายละเอียดของโครงการสามารถแนบเป็นเอกสารแนบมาได้
            และในกรณีที่บริษัทนำเสนอโครงการสหกิจเป็นครั้งแรกให้กับทางภาควิชาวิทยาการคอมพิวเตอร์
            คณะวิทยาศาสตร์ สจล.
            กรุณาแนบเอกสารแนะนำบริษัทของท่านมาในเอกสารแนบด้วย
          </div>

          <div className="file-upload-zone">
            <label className="upload-label" style={{ cursor: "pointer" }}>
              <Upload size={30} className="upload-icon" />
              <p className="upload-text">คลิกเพื่ออัปโหลดเอกสารแนบเพิ่ม</p>
              <span className="upload-subtext">
                (รองรับ PDF ขนาดไม่เกิน 5MB)
              </span>
              {/* 🌟 เพิ่ม onChange เข้าไปให้ Input เลือกไฟล์ทำงานได้ */}
              <input
                type="file"
                hidden
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* 🌟 เพิ่ม UI แสดงไฟล์ที่เพิ่งเลือกเข้ามาใหม่ (เหมือนหน้า Create) */}
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                background: "#f8fafc",
                borderRadius: "8px",
                marginTop: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <FileText size={18} color="#ef4444" />
              <span style={{ flex: 1, fontSize: "14px" }}>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                style={{
                  color: "#ef4444",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
