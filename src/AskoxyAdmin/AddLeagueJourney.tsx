import React, { useState } from "react";
import { adminApi as axios } from "../utils/axiosInstances";
import { message, Modal } from "antd";
import BASE_URL from "../Config";

interface UploadedImage {
  imageUrl: string;
  status: boolean;
}

interface JobForm {
  journeyName: string;
  jobRole: string; // Title stored as campaignType
  jobDescription: string; // (campaignDescription)
  images: UploadedImage[]; // (images[])
  addedBy: string; // (campaignTypeAddBy)
}

const SERVICE_TYPE_CONST = "WEAREHIRING"; // default
const INPUT_TYPE_LOCKED = "SERVICE"; // force SERVICE, not PRODUCT

const AddLeagueJourney: React.FC = () => {
  const [form, setForm] = useState<JobForm>({
    journeyName: "",
    jobRole: "",
    jobDescription: "",
    images: [],
    addedBy: "RAMA",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [journeyNameErr, setJourneyNameErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [counts, setCounts] = useState({
    journeyName: 0,
    jobRole: 0,
    jobDescription: 0,
  });

  const onInput =
    (name: keyof JobForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = e.target.value;
      const limits: Record<string, number> = {
        journeyName: 255,
        jobRole: 255,
        jobDescription: 10000,
      };
      if (limits[name] && value.length > limits[name]) return;
      setForm((p) => ({ ...p, [name]: value }));
      if (limits[name]) setCounts((c) => ({ ...c, [name]: value.length }));
      if (name === "journeyName") setJourneyNameErr("");
      if (name === "jobRole") setNameErr("");
      if (name === "jobDescription") setDescErr("");
    };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

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
            headers: { "Content-Type": "multipart/form-data" },
          },
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
    if (!form.journeyName.trim()) {
      setJourneyNameErr("Journey Name is required");
      ok = false;
    }
    if (!form.jobRole.trim()) {
      setNameErr("Title is required");
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
    setJourneyNameErr("");
    setNameErr("");
    setDescErr("");
    if (!validate()) return;

    Modal.confirm({
      title: "Add League Journey?",
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
          journeyName: form.journeyName.trim(),
          campaignType: form.jobRole,
          campaignDescription: form.jobDescription + disclaimerText,
          images: form.images,
          campaignTypeAddBy: form.addedBy,

          // locked type and renamed field
          campainInputType: INPUT_TYPE_LOCKED,
          addServiceType: "LEAGUEJOURNEYS", // ✅ renamed here
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
        },
      );

      if (res.data) {
        message.success("League journey added successfully!");
        setForm({
          journeyName: "",
          jobRole: "",
          jobDescription: "",
          images: [],
          addedBy: "RAMA",
        });
        setCounts({ journeyName: 0, jobRole: 0, jobDescription: 0 });
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
    <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Add League Journey</h1>
            <p className="mt-1 text-sm text-gray-500">Add the journey name, title, description and media.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
            <h2 className="text-base font-semibold text-gray-800">League Journey Details</h2>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Journey Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.journeyName}
                  onChange={onInput("journeyName")}
                  placeholder="Example: Sovereign AI Journey"
                  maxLength={255}
                  className={`h-10 w-full rounded-md border px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${journeyNameErr ? "border-red-400" : "border-gray-300"}`}
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-red-500">{journeyNameErr}</span>
                  <span className="text-gray-400">{counts.journeyName}/255</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.jobRole}
                  onChange={onInput("jobRole")}
                  placeholder="Enter the journey title"
                  maxLength={255}
                  className={`h-10 w-full rounded-md border px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${nameErr ? "border-red-400" : "border-gray-300"}`}
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-red-500">{nameErr}</span>
                  <span className="text-gray-400">{counts.jobRole}/255</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <textarea
                rows={7}
                value={form.jobDescription}
                onChange={onInput("jobDescription")}
                placeholder="Enter a clear description for this journey"
                maxLength={10000}
                className={`w-full resize-y rounded-md border px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${descErr ? "border-red-400" : "border-gray-300"}`}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-red-500">{descErr}</span>
                <span className="text-gray-400">{counts.jobDescription}/10000</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Images <span className="font-normal text-gray-400">(optional)</span></label>
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-center hover:border-blue-400 hover:bg-blue-50">
                <span className="text-sm font-medium text-gray-700">Choose images</span>
                <span className="mt-1 text-xs text-gray-500">JPG or PNG, multiple files supported</span>
                <input type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" onChange={handleFileChange} />
              </label>
              {isUploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
              {imgErr && <p className="mt-2 text-sm text-red-500">{imgErr}</p>}

              {form.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {form.images.map((img, idx) => (
                    <div key={`${img.imageUrl}-${idx}`} className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <img src={img.imageUrl} alt={`Journey ${idx + 1}`} className="aspect-square h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white text-lg leading-none text-red-500 shadow">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-sm">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Added By</label>
              <select value={form.addedBy} onChange={onInput("addedBy")} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option value="RAMA">RAMA</option>
                <option value="RADHA">RADHA</option>
                <option value="SRIDHAR">SRIDHAR</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={() => {
                setForm({ journeyName: "", jobRole: "", jobDescription: "", images: [], addedBy: "RAMA" });
                setCounts({ journeyName: 0, jobRole: 0, jobDescription: 0 });
                setJourneyNameErr(""); setNameErr(""); setDescErr(""); setImgErr("");
              }}
              className="h-10 rounded-md border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Clear</button>
            <button type="submit" disabled={isSubmitting || isUploading} className="h-10 rounded-md bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Saving..." : "Save Journey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeagueJourney;