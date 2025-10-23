// WeAreHiringAdd.tsx
import React, { useState } from "react";
import axios from "axios";
import { message, Modal } from "antd";
import BASE_URL from "../Config";

interface UploadedImage {
  imageUrl: string;
  status: boolean;
}

interface JobForm {
  jobRole: string; // (campaignType)
  jobDescription: string; // (campaignDescription)
  images: UploadedImage[]; // (images[])
  addedBy: string; // (campaignTypeAddBy)
}

const SERVICE_TYPE_CONST = "WEAREHIRING"; // default
const INPUT_TYPE_LOCKED = "SERVICE"; // force SERVICE, not PRODUCT

const WeAreHiringAdd: React.FC = () => {
  const [form, setForm] = useState<JobForm>({
    jobRole: "",
    jobDescription: "",
    images: [],
    addedBy: "RAMA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [counts, setCounts] = useState({ jobRole: 0, jobDescription: 0 });

  const onInput =
    (name: keyof JobForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;
      const limits: Record<string, number> = {
        jobRole: 255,
        jobDescription: 10000,
      };
      if (limits[name] && value.length > limits[name]) return;
      setForm((p) => ({ ...p, [name]: value }));
      if (limits[name]) setCounts((c) => ({ ...c, [name]: value.length }));
      if (name === "jobRole") setNameErr("");
      if (name === "jobDescription") setDescErr("");
    };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const accessToken = localStorage.getItem("accessToken");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const dup = form.images.some((it) => it.imageUrl.endsWith(file.name));
      if (dup) {
        setImgErr("Image already added.");
        continue;
      }

      try {
        setIsUploading(true);
        const fd = new FormData();
        fd.append("file", file);

        const res = await axios.post(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data?.uploadStatus === "UPLOADED") {
          setForm((p) => ({
            ...p,
            images: [
              ...p.images,
              { imageUrl: res.data.documentPath, status: true },
            ],
          }));
          setImgErr("");
        } else {
          setImgErr("Failed to upload the image. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setImgErr("Failed to upload the image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }

    // allow re-uploading the same file name
    event.target.value = "";
  };

  const removeImage = (idx: number) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    let ok = true;
    if (!form.jobRole.trim()) {
      setNameErr("JOB Role is required");
      ok = false;
    }
    if (!form.jobDescription.trim()) {
      setDescErr("Job Description is required");
      ok = false;
    }
    return ok;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameErr("");
    setDescErr("");
    if (!validate()) return;

    Modal.confirm({
      title: "Add this Job?",
      content: "Please confirm the details before submitting.",
      onOk: () => {
        setIsSubmitting(true);
        submit();
      },
    });
  };

  const submit = async () => {
    const disclaimerText = `

### ✅ *Disclaimer*
*This ${INPUT_TYPE_LOCKED} is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]*`;

    const payload = {
      askOxyCampaignDto: [
        {
          campaignType: form.jobRole,
          campaignDescription: form.jobDescription + disclaimerText,
          images: form.images,
          campaignTypeAddBy: form.addedBy,

          // locked type and renamed field
          campainInputType: INPUT_TYPE_LOCKED,
          addServiceType: "WEAREHIRING", // ✅ renamed here
        },
      ],
    };

    try {
      const res = await axios.patch(
        BASE_URL + "/marketing-service/campgin/addCampaignTypes",
        payload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data) {
        message.success("Job added successfully!");
        setForm({
          jobRole: "",
          jobDescription: "",
          images: [],
          addedBy: "RAMA",
        });
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="max-w-2xl w-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          We Are Hiring — Add Job
        </h1>

        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6">
          {/* JOB Role */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <strong>JOB Role</strong>
            </label>
            <input
              type="text"
              placeholder="e.g., Senior React Developer"
              value={form.jobRole}
              onChange={onInput("jobRole")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              maxLength={255}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {counts.jobRole}/255
            </div>
            {nameErr && <p className="text-red-500 text-sm mt-1">{nameErr}</p>}
          </div>

          {/* Job Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <strong>Job Description</strong>
            </label>
            <textarea
              rows={6}
              placeholder="Role summary, responsibilities, required skills, location, CTC, how to apply…"
              value={form.jobDescription}
              onChange={onInput("jobDescription")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              maxLength={10000}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {counts.jobDescription}/10000
            </div>
            {descErr && <p className="text-red-500 text-sm mt-1">{descErr}</p>}
          </div>

          {/* Upload Image */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span>Choose Images</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <p className="text-xs text-gray-600 mt-2">
              Multiple images allowed. Each &lt; 20 MB, JPG/PNG only.
            </p>

            {isUploading && (
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <div className="w-4 h-4 mr-2 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                Uploading…
              </div>
            )}
            {imgErr && <p className="text-red-500 text-sm mt-2">{imgErr}</p>}

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={img.imageUrl}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white rounded-full w-8 h-8 grid place-content-center"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Job By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Job By
            </label>
            <select
              value={form.addedBy}
              onChange={onInput("addedBy")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="RAMA">RAMA</option>
              <option value="RADHA">RADHA</option>
              <option value="SRIDHAR">SRIDHAR</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 text-white rounded ${
              isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Add Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeAreHiringAdd;
