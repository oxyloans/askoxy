import React, { useEffect, useMemo, useRef, useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";
import { message, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

interface EditGamesBlogData {
  campaignId?: string;
  id?: string;
  campaignTitle?: string;
  campaignTypeAddBy?: string;
  team1?: string;
  team2?: string;
  team3?: string;
  team4?: string;
  pollEndTime?: number | string;
  campaignDescription?: string;
  socialMediaCaption?: string;
  campaignStatus?: boolean | string;
  imageUrl?: string;
  imageUrls?: string[];
  images?: { imageUrl?: string; status?: boolean }[];
}

interface GamesBlogForm {
  id?: string;
  campaignTitle: string;
  campaignTypeAddBy: string;
  team1: string;
  team2: string;
  team3: string;
  team4: string;
  pollEndTime: string;
  campaignDescription: string;
  socialMediaCaption: string;
  campaignStatus: boolean;
  imageUrl: string;
}

const initialForm: GamesBlogForm = {
  id: "",
  campaignTitle: "",
  campaignTypeAddBy: "ADMIN",
  team1: "",
  team2: "",
  team3: "",
  team4: "",
  pollEndTime: "",
  campaignDescription: "",
  socialMediaCaption: "",
  campaignStatus: true,
  imageUrl: "",
};

const ADD_UPDATE_API = `${BASE_URL}/marketing-service/campgin/add-games-blog`;

const AddGamesBlog: React.FC = () => {
  const [formData, setFormData] = useState<GamesBlogForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [captionError, setCaptionError] = useState("");
  const [teamsError, setTeamsError] = useState("");
  const [pollEndTimeError, setPollEndTimeError] = useState("");
  const [mediaErrorMessage, setMediaErrorMessage] = useState("");

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const editData = (location.state as { blogData?: EditGamesBlogData } | null)?.blogData;
  const isEditMode = useMemo(() => Boolean(formData.id), [formData.id]);

  const formatDateTimeLocal = (value?: number | string) => {
    if (!value) return "";
    const date = new Date(Number(value));
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const normalizeDescriptionText = (value: string) => {
    return value
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n");
  };

  const stripMarkdownForValidation = (value: string) => {
    return value.replace(/\*\*(.*?)\*\*/g, "$1").trim();
  };

  const convertHtmlToMarkdownText = (html: string) => {
    const root = document.createElement("div");
    root.innerHTML = html;

    const walk = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      const childrenText = Array.from(el.childNodes).map(walk).join("");

      if (tag === "br") return "\n";

      if (tag === "strong" || tag === "b") {
        const text = childrenText.trim();
        return text ? `**${text}**` : "";
      }

      if (tag === "em" || tag === "i") {
        return childrenText;
      }

      if (tag === "p" || tag === "div") {
        const txt = childrenText.trim();
        return txt ? `${txt}\n` : "";
      }

      if (tag === "li") {
        const txt = childrenText.trim();
        return txt ? `• ${txt}\n` : "";
      }

      if (tag === "ul" || tag === "ol") {
        return `${childrenText}\n`;
      }

      return childrenText;
    };

    return normalizeDescriptionText(
      Array.from(root.childNodes)
        .map(walk)
        .join("")
        .trim()
    );
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || editData.campaignId || "",
        campaignTitle: editData.campaignTitle || "",
        campaignTypeAddBy:
          typeof editData.campaignTypeAddBy === "string" &&
          editData.campaignTypeAddBy.trim()
            ? editData.campaignTypeAddBy.trim()
            : "ADMIN",
        team1: editData.team1 || "",
        team2: editData.team2 || "",
        team3: editData.team3 || "",
        team4: editData.team4 || "",
        pollEndTime: formatDateTimeLocal(editData.pollEndTime),
        campaignDescription: normalizeDescriptionText(editData.campaignDescription || ""),
        socialMediaCaption: editData.socialMediaCaption || "",
        campaignStatus:
          typeof editData.campaignStatus === "boolean"
            ? editData.campaignStatus
            : String(editData.campaignStatus).toLowerCase() === "true",
        imageUrl:
          editData.imageUrl ||
          editData.imageUrls?.[0] ||
          editData.images?.[0]?.imageUrl ||
          "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  const clearErrors = () => {
    setTitleError("");
    setDescriptionError("");
    setCaptionError("");
    setTeamsError("");
    setPollEndTimeError("");
    setMediaErrorMessage("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "campaignDescription" ? normalizeDescriptionText(value) : value,
    }));

    if (name === "campaignTitle") setTitleError("");
    if (name === "campaignDescription") setDescriptionError("");
    if (name === "socialMediaCaption") setCaptionError("");
    if (["team1", "team2", "team3", "team4"].includes(name)) setTeamsError("");
    if (name === "pollEndTime") setPollEndTimeError("");
  };

  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.campaignDescription.slice(start, end);
    const replacement = `${prefix}${selectedText || "Text"}${suffix}`;

    const updated =
      formData.campaignDescription.slice(0, start) +
      replacement +
      formData.campaignDescription.slice(end);

    setFormData((prev) => ({
      ...prev,
      campaignDescription: normalizeDescriptionText(updated),
    }));

    setTimeout(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = start + replacement.length - suffix.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updated =
      formData.campaignDescription.slice(0, start) +
      text +
      formData.campaignDescription.slice(end);

    setFormData((prev) => ({
      ...prev,
      campaignDescription: normalizeDescriptionText(updated),
    }));

    setTimeout(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const handleDescriptionPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (!html) return;

    e.preventDefault();

    const converted = convertHtmlToMarkdownText(html);
    const fallback = normalizeDescriptionText(text || "");
    const finalText = converted || fallback;

    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updated =
      formData.campaignDescription.slice(0, start) +
      finalText +
      formData.campaignDescription.slice(end);

    setFormData((prev) => ({
      ...prev,
      campaignDescription: normalizeDescriptionText(updated),
    }));

    setTimeout(() => {
      textarea.focus();
      const cursor = start + finalText.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const validateForm = () => {
    let isValid = true;
    clearErrors();

    if (!formData.campaignTitle.trim()) {
      setTitleError("Campaign title is required");
      isValid = false;
    } else if (formData.campaignTitle.trim().length < 3) {
      setTitleError("Campaign title must be at least 3 characters");
      isValid = false;
    }

    if (!formData.team1.trim() || !formData.team2.trim()) {
      setTeamsError("Team 1 and Team 2 are mandatory");
      isValid = false;
    } else if (
      formData.team1.trim().toLowerCase() === formData.team2.trim().toLowerCase()
    ) {
      setTeamsError("Team 1 and Team 2 must be different");
      isValid = false;
    }

    if (!formData.pollEndTime) {
      setPollEndTimeError("Vote end time is required");
      isValid = false;
    } else if (new Date(formData.pollEndTime).getTime() <= Date.now()) {
      setPollEndTimeError("Vote end time must be a future date and time");
      isValid = false;
    }

    if (!stripMarkdownForValidation(formData.campaignDescription)) {
      setDescriptionError("Campaign description is required");
      isValid = false;
    }

    if (!formData.socialMediaCaption.trim()) {
      setCaptionError("Social media caption is required");
      isValid = false;
    } else if (formData.socialMediaCaption.trim().length < 5) {
      setCaptionError("Social media caption must be at least 5 characters");
      isValid = false;
    }

    return isValid;
  };

  const isImageFile = (file: File): boolean => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return imageTypes.includes(file.type);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];

    if (!isImageFile(file)) {
      setMediaErrorMessage("Only JPG, JPEG, PNG, and WEBP files are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMediaErrorMessage("Image size must be less than 5MB");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await axios.post(
        "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.uploadStatus === "UPLOADED" && response?.data?.documentPath) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.documentPath,
        }));
        setMediaErrorMessage("");
        message.success("Image uploaded successfully");
      } else {
        setMediaErrorMessage("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMediaErrorMessage("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const buildPayload = () => {
    const payload: Record<string, any> = {
      campaignTitle: formData.campaignTitle.trim(),
      campaignTypeAddBy: formData.campaignTypeAddBy || "ADMIN",
      team1: formData.team1.trim(),
      team2: formData.team2.trim(),
      team3: formData.team3.trim(),
      team4: formData.team4.trim(),
      pollEndTime: new Date(formData.pollEndTime).getTime(),
      campaignDescription: normalizeDescriptionText(formData.campaignDescription.trim()),
      socialMediaCaption: formData.socialMediaCaption.trim(),
      campaignStatus: formData.campaignStatus,
    };

    if (formData.imageUrl.trim()) {
      payload.imageUrl = formData.imageUrl.trim();
    }

    if (isEditMode && formData.id) {
      payload.id = formData.id;
    }

    return payload;
  };

  const submitGamesBlog = async () => {
    try {
      setIsSubmitting(true);

      const payload = buildPayload();

      await axios.patch(ADD_UPDATE_API, payload, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      message.success(
        isEditMode ? "Vote blog updated successfully" : "Vote blog added successfully"
      );

      navigate("/admn/allroleblogs", { replace: true });
    } catch (error: any) {
      console.error("Submit games blog error:", error);

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message;

      message.error(
        apiMessage ||
          (isEditMode ? "Failed to update vote blog" : "Failed to add vote blog")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      message.error("Please fix the required fields before submitting");
      return;
    }

    Modal.confirm({
      title: isEditMode ? "Confirm Update" : "Confirm Add",
      content: isEditMode
        ? "Are you sure you want to update this vote blog?"
        : "Are you sure you want to add this vote blog?",
      okText: isEditMode ? "Update" : "Add",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        await submitGamesBlog();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-4 py-5 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-5 text-white sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  {isEditMode ? "Update Poll Blog" : "Add Poll Blog"}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admn/allroleblogs")}
                className="inline-flex items-center justify-center rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25 border border-white/25"
              >
                All Poll Blogs
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
                {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Team 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="team1"
                  value={formData.team1}
                  onChange={handleInputChange}
                  placeholder="Enter team 1"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Team 2 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="team2"
                  value={formData.team2}
                  onChange={handleInputChange}
                  placeholder="Enter team 2"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Team 3
                </label>
                <input
                  type="text"
                  name="team3"
                  value={formData.team3}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Team 4
                </label>
                <input
                  type="text"
                  name="team4"
                  value={formData.team4}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
              </div>

              {teamsError && <p className="md:col-span-2 -mt-2 text-sm text-red-600">{teamsError}</p>}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vote End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="pollEndTime"
                  value={formData.pollEndTime}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
                {pollEndTimeError && (
                  <p className="mt-1 text-sm text-red-600">{pollEndTimeError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Blog Description <span className="text-red-500">*</span>
                </label>

                <div className="mb-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => wrapSelectedText("**")}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Bold
                  </button>

                  <button
                    type="button"
                    onClick={() => insertAtCursor("\n• ")}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Bullet
                  </button>

                  <button
                    type="button"
                    onClick={() => insertAtCursor("\n")}
                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    New Line
                  </button>
                </div>

                <textarea
                  ref={descriptionRef}
                  name="campaignDescription"
                  value={formData.campaignDescription}
                  onChange={handleInputChange}
                  onPaste={handleDescriptionPaste}
                  placeholder={`Example:
**Match Preview**
KKR looks strong today.

**Key Players**
Russell and Narine can change the game.`}
                  rows={10}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />

                {descriptionError && (
                  <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Social Media Caption <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="socialMediaCaption"
                  value={formData.socialMediaCaption}
                  onChange={handleInputChange}
                  placeholder="Enter social media caption"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500"
                />
                {captionError && <p className="mt-1 text-sm text-red-600">{captionError}</p>}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <input
                    id="campaignStatus"
                    type="checkbox"
                    name="campaignStatus"
                    checked={formData.campaignStatus}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="campaignStatus"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Active Blog
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload Image
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
                    {isUploading ? "Uploading..." : "Choose Image"}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  {formData.imageUrl && (
                    <a
                      href={formData.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-blue-600 underline"
                    >
                      View Uploaded Image
                    </a>
                  )}
                </div>

                {mediaErrorMessage && (
                  <p className="mt-2 text-sm text-red-600">{mediaErrorMessage}</p>
                )}

                {formData.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded preview"
                      className="h-48 w-full max-w-md rounded-2xl border border-slate-200 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Poll Blog"
                    : "Add Poll Blog"}
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGamesBlog;