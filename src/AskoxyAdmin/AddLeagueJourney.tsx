import React, { useMemo, useState } from "react";
import { message, Modal } from "antd";
import { adminApi as axios } from "../utils/axiosInstances";
import BASE_URL from "../Config";

interface UploadedImage {
  imageUrl: string;
  status: boolean;
}

interface JourneyForm {
  journeyName: string;
  campaignType: string;
  campaignDescription: string;
  images: UploadedImage[];
  addedBy: string;
}

interface FormErrors {
  journeyName?: string;
  campaignType?: string;
  campaignDescription?: string;
  images?: string;
}

const INPUT_TYPE_LOCKED = "SERVICE";
const ADD_SERVICE_TYPE = "LEAGUEJOURNEYS";
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const initialForm: JourneyForm = {
  journeyName: "",
  campaignType: "",
  campaignDescription: "",
  images: [],
  addedBy: "RAMA",
};

const AddLeagueJourney: React.FC = () => {
  const [form, setForm] = useState<JourneyForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const completion = useMemo(() => {
    const fields = [
      form.journeyName.trim(),
      form.campaignType.trim(),
      form.campaignDescription.trim(),
      form.addedBy.trim(),
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [form]);

  const updateField = <K extends keyof JourneyForm>(
    key: K,
    value: JourneyForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.journeyName.trim()) {
      nextErrors.journeyName = "Journey name is required.";
    }
    if (!form.campaignType.trim()) {
      nextErrors.campaignType = "Journey type is required.";
    }
    if (!form.campaignDescription.trim()) {
      nextErrors.campaignDescription = "Journey description is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const invalidFile = selectedFiles.find(
      (file) =>
        !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
    );

    if (invalidFile) {
      setErrors((prev) => ({
        ...prev,
        images: "Use JPG or PNG files smaller than 20 MB.",
      }));
      return;
    }

    setIsUploading(true);
    setErrors((prev) => ({ ...prev, images: undefined }));

    try {
      for (const file of selectedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await axios.post(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (response.data?.uploadStatus !== "UPLOADED") {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const imageUrl = response.data.documentPath;
        setForm((prev) => {
          const alreadyExists = prev.images.some(
            (image) => image.imageUrl === imageUrl,
          );
          if (alreadyExists) return prev;
          return {
            ...prev,
            images: [...prev.images, { imageUrl, status: true }],
          };
        });
      }
      message.success("Media uploaded successfully.");
    } catch (error) {
      console.error("Media upload failed:", error);
      setErrors((prev) => ({
        ...prev,
        images: "Some files could not be uploaded. Please try again.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const submitJourney = async () => {
    const disclaimerText = `\n\n### Disclaimer\n*This ${INPUT_TYPE_LOCKED} is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]*`;

    const payload = {
      askOxyCampaignDto: [
        {
          journeyName: form.journeyName.trim(),
          campaignType: form.campaignType.trim(),
          campaignDescription:
            form.campaignDescription.trim() + disclaimerText,
          images: form.images,
          campaignTypeAddBy: form.addedBy,
          campainInputType: INPUT_TYPE_LOCKED,
          addServiceType: ADD_SERVICE_TYPE,
        },
      ],
    };

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/marketing-service/campgin/addCampaignTypes`,
        payload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data) {
        throw new Error("Empty response received");
      }

      message.success("League journey added successfully.");
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error("Failed to add league journey:", error);
      message.error("Unable to add the journey. Please try again.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    Modal.confirm({
      title: "Create league journey?",
      content:
        "Please review the journey name, type, description, and media before submitting.",
      okText: "Create Journey",
      cancelText: "Review Again",
      centered: true,
      onOk: submitJourney,
    });
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-5 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100">
                LEAGUE JOURNEY ADMIN
              </span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
                Create a new league journey
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Add a unique journey name, configure its type and description,
                upload media, and publish it for filtering across the platform.
              </p>
            </div>

            <div className="min-w-[220px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Form completion</span>
                <strong>{completion}%</strong>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Journey information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fields marked with an asterisk are required.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Journey Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.journeyName}
                  onChange={(event) =>
                    updateField("journeyName", event.target.value)
                  }
                  className={inputClass(errors.journeyName)}
                  placeholder="Example: AI Career Journey"
                  maxLength={255}
                />
                <div className="mt-1 flex justify-between gap-3 text-xs">
                  <span className="text-red-500">{errors.journeyName}</span>
                  <span className="ml-auto text-slate-400">
                    {form.journeyName.length}/255
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Journey Type <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.campaignType}
                  onChange={(event) =>
                    updateField("campaignType", event.target.value)
                  }
                  className={inputClass(errors.campaignType)}
                  placeholder="Example: Career Development"
                  maxLength={255}
                />
                <div className="mt-1 flex justify-between gap-3 text-xs">
                  <span className="text-red-500">{errors.campaignType}</span>
                  <span className="ml-auto text-slate-400">
                    {form.campaignType.length}/255
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Journey Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.campaignDescription}
                onChange={(event) =>
                  updateField("campaignDescription", event.target.value)
                }
                className={`${inputClass(errors.campaignDescription)} min-h-[190px] resize-y`}
                placeholder="Explain the journey, who it is for, the value it provides, and the expected outcome."
                maxLength={10000}
              />
              <div className="mt-1 flex justify-between gap-3 text-xs">
                <span className="text-red-500">
                  {errors.campaignDescription}
                </span>
                <span className="ml-auto text-slate-400">
                  {form.campaignDescription.length}/10000
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Journey Media
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Optional. Upload multiple JPG or PNG files, maximum 20 MB each.
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {form.images.length} file{form.images.length === 1 ? "" : "s"}
                </span>
              </div>

              <label className="mt-3 flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
                <svg
                  className="h-9 w-9 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 7.5L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span className="mt-2 text-sm font-semibold text-slate-700">
                  {isUploading ? "Uploading media..." : "Choose images to upload"}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Click here to select one or more files
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {errors.images && (
                <p className="mt-2 text-sm text-red-500">{errors.images}</p>
              )}

              {form.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image.imageUrl}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`Journey media ${index + 1}`}
                        className="aspect-[4/3] h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-lg font-bold text-red-500 shadow transition hover:bg-red-500 hover:text-white"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                Publishing settings
              </h3>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Added By
                </label>
                <select
                  value={form.addedBy}
                  onChange={(event) =>
                    updateField("addedBy", event.target.value)
                  }
                  className={inputClass()}
                >
                  <option value="RAMA">RAMA</option>
                  <option value="RADHA">RADHA</option>
                  <option value="SRIDHAR">SRIDHAR</option>
                </select>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Input type</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    SERVICE
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Service type</span>
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    LEAGUE JOURNEYS
                  </span>
                </div>
              </div>
            </div>

            <div className="sticky top-4 rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">Ready to publish?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The journey name will be saved separately and used to identify,
                search, filter, and update each journey.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Creating Journey..." : "Create League Journey"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setErrors({});
                }}
                disabled={isSubmitting || isUploading}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear Form
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default AddLeagueJourney;