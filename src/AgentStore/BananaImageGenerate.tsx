import React, { useState } from "react";
import {
  Upload,
  Loader2,
  Download,
  AlertCircle,
  X,
  Camera,
} from "lucide-react";

interface UploadedImage {
  imageUrl: string;
  status: boolean;
  base64?: string;
}

interface FormData {
  imageUrl: UploadedImage[];
}

interface ApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
        text?: string;
      }>;
    };
  }>;
}

const BananaImageGenerate: React.FC = () => {
  //   const API_KEY = process.env.GOOGLE_AUTH_TOKEN

  const [formData, setFormData] = useState<FormData>({ imageUrl: [] });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<string>("");

    const PROMPT = `A 4K ultra-realistic cinematic poster of a man leaning stylishly against the side of a 1973 Chevrolet Chevelle Malibu in glossy black, shown in the exact same angle and direction as the reference image. The man is posed confidently, leaning on the car door, with one hand in his pocket and the other holding a small transparent Indian cutting chai glass without handle, gripped naturally between his fingers only. The chai glass is filled with steaming hot tea, with visible vapor rising upwards. The man is dressed in a black leather jacket over a dark maroon/burgundy shirt with the top buttons open, paired with large flared black bell-bottom pants and polished black shoes. His face is clearly visible, with a calm, charismatic expression. On the car door, the phrase appears in two lines: Line 1 (top) "THE FAN OF" in bold white uppercase, Line 2 (below) "OG" in much larger distressed bold red letters. The text is clearly visible, not overlapped by the character's body, blending naturally with the glossy black surface. The background is a cinematic bluish-grey overcast sky, slightly brightened for clarity, with several black birds scattered across the sky in different positions and directions, creating natural depth and motion. The ground is dark asphalt with faint red reflections. Soft cinematic lighting highlights the folds of the jacket, the deep tone of the maroon shirt, the wide flare of the bell-bottom pants, the chai glass held delicately, the steam rising above it, the polished reflections of the Chevelle Malibu, and the bold impactful text on the car door.`;

  // ---------------- Base64 conversion ----------------
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (result && result.includes(",")) {
          const base64String = result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(file);
    });
  };

  // ---------------- File Upload Handler ----------------
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const accessToken = "your-access-token";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        setImageErrorMessage("Please upload only image files");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setImageErrorMessage("File size should be less than 10MB");
        continue;
      }

      const isAlreadyUploaded = formData.imageUrl.some(
        (item) => item.imageUrl === file.name
      );

      if (isAlreadyUploaded) {
        setImageErrorMessage("Image already added");
        continue;
      }

      try {
        setIsUploading(true);
        setImageErrorMessage("");

        const base64 = await fileToBase64(file);

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch(
          "https://meta.oxyloans.com/api/upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: uploadFormData,
          }
        );

        if (!response.ok)
          throw new Error(`Upload failed: ${response.statusText}`);

        const data = await response.json();

        if (data.uploadStatus === "UPLOADED" && data.documentPath) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: [
              ...prev.imageUrl,
              {
                imageUrl: data.documentPath,
                status: true,
                base64, // store base64 for direct use
              },
            ],
          }));
          setImageErrorMessage("");
        } else {
          throw new Error("Upload failed - no document path returned");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setImageErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to upload the image. Please try again."
        );
      } finally {
        setIsUploading(false);
      }
    }
    event.target.value = "";
  };

  // ---------------- Gemini API Request ----------------
  const sendImageRequest = async (
    base64Image: string
  ): Promise<ApiResponse | null> => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.REACT_APP_GOOGLE_AUTH_TOKEN}`;

    const payload = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: base64Image } },
            { text: PROMPT },
          ],
        },
      ],
    };

    try {
      setProgress("Sending request to Gemini AI...");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setProgress("Processing AI response...");
      return result;
    } catch (error) {
      console.error("Error sending request to Gemini:", error);
      throw error;
    }
  };

  const findBase64InResponse = (obj: any): string | null => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const result = findBase64InResponse(item);
          if (result) return result;
        }
      } else {
        for (const [key, value] of Object.entries(obj)) {
          if (key === "data" && typeof value === "string") {
            if (/^[A-Za-z0-9+/=\s\n]+$/.test(value) && value.length > 100) {
              return value.replace(/\s/g, "");
            }
          }
          const result = findBase64InResponse(value);
          if (result) return result;
        }
      }
    }
    return null;
  };

  // ---------------- Generate Button Handler ----------------
  const handleGenerate = async () => {
    if (formData.imageUrl.length === 0) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedImage("");
    setProgress("Starting generation process...");

    try {
      const base64Image = formData.imageUrl[0].base64;

      if (!base64Image)
        throw new Error("No base64 found for the uploaded image");

      const response = await sendImageRequest(base64Image);

      if (!response) throw new Error("No response received from Gemini API");

      const base64Data = findBase64InResponse(response);

      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
        setProgress("Image generated successfully!");
      } else {
        throw new Error("No base64 image found in the API response");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setProgress("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `generated_image_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: prev.imageUrl.filter((_, i) => i !== index),
    }));
    setImageErrorMessage("");
  };

  const clearAll = () => {
    setFormData({ imageUrl: [] });
    setGeneratedImage("");
    setError("");
    setImageErrorMessage("");
    setProgress("");
  };

  // ---------------- UI Rendering ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎨 AI Image Generator
          </h1>
          <p className="text-blue-200">
            Transform your images with Gemini AI - Upload → Generate → Download
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {progress && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-200 text-center">{progress}</p>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-white font-semibold">
                Upload Reference Image
              </label>
              {formData.imageUrl.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
                multiple
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center gap-2 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-12 h-12 text-white/70 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-white/70" />
                )}
                <span className="text-white/80 font-medium">
                  {isUploading
                    ? "Uploading..."
                    : "Click to upload reference image"}
                </span>
                <span className="text-white/60 text-sm">
                  Supports JPG, PNG, GIF (max 20MB)
                </span>
              </label>
            </div>

            {imageErrorMessage && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{imageErrorMessage}</p>
              </div>
            )}
          </div>

          {/* Uploaded Images Preview */}
          {formData.imageUrl.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Reference Images ({formData.imageUrl.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.imageUrl.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white/5 rounded-lg p-2 group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-68 object-cover rounded transition-all duration-200 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjM0Y0RjRGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0E0QUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=";
                      }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || formData.imageUrl.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating with Gemini AI...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Generate AI Image
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-200 font-medium">Generation Failed</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {generatedImage && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Generated Image
                </h3>
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                <img
                  src={generatedImage}
                  alt="AI Generated result"
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BananaImageGenerate;
