import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
} from "antd";
import BASE_URL from "../Config";
import { adminApi as axios } from "../utils/axiosInstances";

interface UploadedImage {
  imageId?: string;
  imageUrl: string;
  status: boolean;
}

interface Journey {
  createdAt: string | number;
  id: string;
  journeyName: string;
  status: boolean;
  updatedAt: string | number;
}

interface CampaignForm {
  journeyId: string;
  jobRole: string;
  jobDescription: string;
  images: UploadedImage[];
  addedBy: string;
}

const INPUT_TYPE_LOCKED = "SERVICE";
const SERVICE_TYPE_LOCKED = "LEAGUEJOURNEYS";
const PRIMARY_COLOR = "#008cba";
const SUCCESS_COLOR = "#1ab394";
const INACTIVE_COLOR = "#64748b";

const getArrayFromResponse = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.data,
      record.object,
      record.content,
      record.result,
      record.journeys,
      record.journeyNames,
      record.journeyNameList,
    ];

    const match = candidates.find(Array.isArray);
    if (match) return match as T[];
  }

  return [];
};

const formatDate = (value?: string | number) => {
  if (!value) return "-";

  const numericValue = Number(value);
  const date = Number.isNaN(numericValue)
    ? new Date(value)
    : new Date(numericValue);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AddLeagueJourney: React.FC = () => {
  const [form, setForm] = useState<CampaignForm>({
    journeyId: "",
    jobRole: "",
    jobDescription: "",
    images: [],
    addedBy: "RAMA",
  });

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [newJourneyName, setNewJourneyName] = useState("");
  const [journeysLoading, setJourneysLoading] = useState(false);
  const [isCreatingJourney, setIsCreatingJourney] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [journeyErr, setJourneyErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [imgErr, setImgErr] = useState("");

  const [counts, setCounts] = useState({
    jobRole: 0,
    jobDescription: 0,
  });

  const activeJourneys = useMemo(
    () => journeys.filter((journey) => journey.status),
    [journeys],
  );

  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.id === form.journeyId) || null,
    [form.journeyId, journeys],
  );

  const fetchJourneys = async () => {
    setJourneysLoading(true);

    try {
      const response = await axios.get(
        BASE_URL + "/marketing-service/campgin/get-all-journey-names",
        {
          headers: { accept: "*/*" },
        },
      );

      const journeyList = getArrayFromResponse<Journey>(response.data)
        .filter((journey) => journey?.id && journey?.journeyName)
        .sort((a, b) => a.journeyName.localeCompare(b.journeyName));

      setJourneys(journeyList);

      setForm((previous) => {
        if (!previous.journeyId) return previous;

        const currentJourney = journeyList.find(
          (journey) => journey.id === previous.journeyId,
        );

        return currentJourney?.status
          ? previous
          : { ...previous, journeyId: "" };
      });
    } catch (error) {
      console.error("Failed to load journey names:", error);
      message.error("Failed to load journey names.");
    } finally {
      setJourneysLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const onInput =
    (name: "jobRole" | "jobDescription" | "addedBy") =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value;
      const limits: Record<string, number> = {
        jobRole: 255,
        jobDescription: 10000,
      };

      if (limits[name] && value.length > limits[name]) return;

      setForm((previous) => ({ ...previous, [name]: value }));

      if (limits[name]) {
        setCounts((previous) => ({
          ...previous,
          [name]: value.length,
        }));
      }

      if (name === "jobRole") setNameErr("");
      if (name === "jobDescription") setDescErr("");
    };

  const createJourney = async () => {
    const journeyName = newJourneyName.trim();

    if (!journeyName) {
      message.warning("Enter a journey name.");
      return;
    }

    const duplicate = journeys.some(
      (journey) =>
        journey.journeyName.trim().toLowerCase() === journeyName.toLowerCase(),
    );

    if (duplicate) {
      message.warning("This journey name already exists.");
      return;
    }

    setIsCreatingJourney(true);

    try {
      const response = await axios.post(
        BASE_URL + "/marketing-service/campgin/create-journey-name",
        { journeyName },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      const createdJourney = (
        response.data?.data || response.data
      ) as Journey | undefined;
      message.success("Journey name created successfully.");
      setNewJourneyName("");
      await fetchJourneys();

      if (createdJourney?.id && createdJourney?.status !== false) {
        setForm((previous) => ({
          ...previous,
          journeyId: createdJourney.id,
        }));
        setJourneyErr("");
      }
    } catch (error) {
      console.error("Failed to create journey name:", error);
      message.error("Failed to create journey name.");
    } finally {
      setIsCreatingJourney(false);
    }
  };

  const updateJourneyStatus = (journey: Journey) => {
    const nextStatus = !journey.status;

    Modal.confirm({
      title: `${nextStatus ? "Activate" : "Deactivate"} journey?`,
      content: `${journey.journeyName} will be marked as ${
        nextStatus ? "active" : "inactive"
      }.`,
      okText: nextStatus ? "Activate" : "Deactivate",
      cancelText: "Cancel",
      okButtonProps: {
        style: {
          backgroundColor: nextStatus ? SUCCESS_COLOR : PRIMARY_COLOR,
          borderColor: nextStatus ? SUCCESS_COLOR : PRIMARY_COLOR,
        },
      },
      onOk: async () => {
        setStatusUpdatingId(journey.id);

        try {
          await axios.patch(
            `${BASE_URL}/marketing-service/campgin/update-joury-status?journeyId=${encodeURIComponent(
              journey.id,
            )}&status=${nextStatus}`,
            {},
            { headers: { accept: "*/*" } },
          );

          message.success("Journey status updated successfully.");
          await fetchJourneys();
        } catch (error) {
          console.error("Failed to update journey status:", error);
          message.error("Failed to update journey status.");
        } finally {
          setStatusUpdatingId(null);
        }
      },
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setImgErr("");

    try {
      for (const file of Array.from(files)) {
        const alreadyAdded = form.images.some((image) =>
          image.imageUrl.endsWith(file.name),
        );

        if (alreadyAdded) {
          setImgErr(`Image already added: ${file.name}`);
          continue;
        }

        const uploadData = new FormData();
        uploadData.append("file", file);

        const response = await axios.post(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          uploadData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data?.uploadStatus !== "UPLOADED") {
          setImgErr(`Failed to upload: ${file.name}`);
          continue;
        }

        setForm((previous) => ({
          ...previous,
          images: [
            ...previous.images,
            {
              imageId: response.data.id,
              imageUrl: response.data.documentPath,
              status: true,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Failed to upload media:", error);
      setImgErr("Failed to upload the image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validate = () => {
    let valid = true;

    if (!form.journeyId) {
      setJourneyErr("Journey is required");
      valid = false;
    }

    if (!form.jobRole.trim()) {
      setNameErr("Title is required");
      valid = false;
    }

    if (!form.jobDescription.trim()) {
      setDescErr("Description is required");
      valid = false;
    }

    return valid;
  };

  const clearCampaignForm = () => {
    setForm({
      journeyId: "",
      jobRole: "",
      jobDescription: "",
      images: [],
      addedBy: "RAMA",
    });
    setCounts({ jobRole: 0, jobDescription: 0 });
    setJourneyErr("");
    setNameErr("");
    setDescErr("");
    setImgErr("");
  };

  const submit = async () => {
    const disclaimerText = `

### ✅ *Disclaimer*
*This ${INPUT_TYPE_LOCKED} is AI-assisted and based on public data. We aim to inform, not infringe. Contact us for edits or collaborations: [support@askoxy.ai]*`;

    const payload = {
      askOxyCampaignDto: [
        {
          journeyId: form.journeyId,
          campaignType: form.jobRole.trim(),
          campaignDescription: form.jobDescription.trim() + disclaimerText,
          images: form.images.map((image) => ({
            ...(image.imageId ? { imageId: image.imageId } : {}),
            imageUrl: image.imageUrl,
            status: image.status,
          })),
          campaignTypeAddBy: form.addedBy,
          campainInputType: INPUT_TYPE_LOCKED,
          addServiceType: SERVICE_TYPE_LOCKED,
        },
      ],
    };

    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        BASE_URL + "/marketing-service/campgin/addCampaignTypes",
        payload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data) {
        message.success("League journey campaign added successfully.");
        clearCampaignForm();
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add league journey campaign:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setJourneyErr("");
    setNameErr("");
    setDescErr("");

    if (!validate()) return;

    Modal.confirm({
      title: "Add League Journey Campaign?",
      content: `Create this campaign under ${
        selectedJourney?.journeyName || "the selected journey"
      }?`,
      okText: "Create",
      okButtonProps: {
        style: {
          backgroundColor: SUCCESS_COLOR,
          borderColor: SUCCESS_COLOR,
        },
      },
      onOk: submit,
    });
  };

  const journeyColumns = [
    {
      title: "Journey Name",
      dataIndex: "journeyName",
      key: "journeyName",
      render: (value: string) => (
        <span className="font-medium text-gray-800">{value}</span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md" as const],
      render: (value: string | number) => formatDate(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <Tag
          bordered={false}
          style={{
            backgroundColor: status ? "#e8f8f4" : "#f1f5f9",
            color: status ? "#087f67" : INACTIVE_COLOR,
            fontWeight: 600,
            minWidth: 68,
            textAlign: "center",
          }}
        >
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Change Status",
      key: "action",
      render: (_: unknown, journey: Journey) => (
        <Switch
          checked={journey.status}
          loading={statusUpdatingId === journey.id}
          onChange={() => updateJourneyStatus(journey)}
          checkedChildren="On"
          unCheckedChildren="Off"
          aria-label={`${journey.status ? "Deactivate" : "Activate"} ${journey.journeyName}`}
          style={{
            backgroundColor: journey.status ? SUCCESS_COLOR : INACTIVE_COLOR,
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Journey Master
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create journey names and activate or deactivate them.
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={newJourneyName}
                onChange={(event) => setNewJourneyName(event.target.value)}
                onPressEnter={createJourney}
                maxLength={255}
                placeholder="Example: Lender Journey"
                disabled={isCreatingJourney}
              />
              <Button
                type="primary"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  borderColor: PRIMARY_COLOR,
                }}
                onClick={createJourney}
                loading={isCreatingJourney}
                className="sm:min-w-40 hover:brightness-95"
              >
                Create Journey
              </Button>
            </div>

            <div className="mt-5">
              {journeysLoading ? (
                <div className="flex min-h-32 items-center justify-center">
                  <Spin tip="Loading journeys..." />
                </div>
              ) : (
                <Table
                  rowKey="id"
                  columns={journeyColumns}
                  dataSource={journeys}
                  pagination={{ pageSize: 5, hideOnSinglePage: true }}
                  scroll={{ x: 620 }}
                  locale={{ emptyText: "No journey names found." }}
                />
              )}
            </div>
          </div>
        </section>

        <form
          onSubmit={onSubmit}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Add League Journey Campaign
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Select an active journey and add its campaign details.
            </p>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Journey <span className="text-red-500">*</span>
                </label>
                <Select
                  showSearch
                  allowClear
                  value={form.journeyId || undefined}
                  loading={journeysLoading}
                  placeholder="Select an active journey"
                  className="w-full"
                  optionFilterProp="label"
                  options={activeJourneys.map((journey) => ({
                    value: journey.id,
                    label: journey.journeyName,
                  }))}
                  onChange={(journeyId) => {
                    setForm((previous) => ({
                      ...previous,
                      journeyId: journeyId || "",
                    }));
                    setJourneyErr("");
                  }}
                  notFoundContent={
                    journeysLoading ? <Spin size="small" /> : "No active journeys"
                  }
                />
                <p className="mt-1 text-xs text-red-500">{journeyErr}</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.jobRole}
                  onChange={onInput("jobRole")}
                  placeholder="Enter the campaign title"
                  maxLength={255}
                  className={`h-10 w-full rounded-md border px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                    nameErr ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-red-500">{nameErr}</span>
                  <span className="text-gray-400">{counts.jobRole}/255</span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={7}
                value={form.jobDescription}
                onChange={onInput("jobDescription")}
                placeholder="Enter a clear description for this campaign"
                maxLength={10000}
                className={`w-full resize-y rounded-md border px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                  descErr ? "border-red-400" : "border-gray-300"
                }`}
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-red-500">{descErr}</span>
                <span className="text-gray-400">
                  {counts.jobDescription}/10000
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Images
                <span className="font-normal text-gray-400"> (optional)</span>
              </label>
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-center hover:border-blue-400 hover:bg-blue-50">
                <span className="text-sm font-medium text-gray-700">
                  Choose images
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  JPG or PNG, multiple files supported
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {isUploading && (
                <p className="mt-2 text-sm text-blue-600">Uploading...</p>
              )}
              {imgErr && <p className="mt-2 text-sm text-red-500">{imgErr}</p>}

              {form.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image.imageUrl}-${index}`}
                      className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`Journey campaign ${index + 1}`}
                        className="aspect-square h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white text-lg leading-none text-red-500 shadow"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-sm">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Added By
              </label>
              <select
                value={form.addedBy}
                onChange={onInput("addedBy")}
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="RAMA">RAMA</option>
                <option value="RADHA">RADHA</option>
                <option value="SRIDHAR">SRIDHAR</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
            <Button onClick={clearCampaignForm} className="sm:min-w-24">
              Clear
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isUploading || journeysLoading}
              style={{
                backgroundColor: SUCCESS_COLOR,
                borderColor: SUCCESS_COLOR,
              }}
              className="sm:min-w-36 hover:brightness-95"
            >
              Save Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeagueJourney;
