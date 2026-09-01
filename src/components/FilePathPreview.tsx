import React from "react";

type FileKind = "image" | "video" | "pdf" | "text" | "document";

const getFileKind = (filePath: string): FileKind => {
  const pathname = filePath.split("?")[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(pathname)) return "image";
  if (/\.(mp4|webm|ogg|mov|m4v)$/.test(pathname)) return "video";
  if (/\.pdf$/.test(pathname)) return "pdf";
  if (/\.(txt|log|csv|json|xml)$/i.test(pathname)) return "text";
  return "document";
};

export const FilePathPreview: React.FC<{ filePath: string }> = ({ filePath }) => {
  const fileKind = getFileKind(filePath);
  const previewUrl =
    fileKind === "document"
      ? `https://docs.google.com/gview?url=${encodeURIComponent(filePath)}&embedded=true`
      : filePath;

  if (fileKind === "image") {
    return <img src={filePath} alt="Uploaded document" style={{ width: "100%", borderRadius: 8 }} />;
  }

  if (fileKind === "video") {
    return <video src={filePath} controls style={{ width: "100%", borderRadius: 8 }} />;
  }

  return (
    <div>
      <iframe
        src={previewUrl}
        title="Uploaded document preview"
        style={{ width: "100%", height: 460, border: "none", borderRadius: 8 }}
      />
      <a
        href={filePath}
        target="_blank"
        rel="noopener noreferrer"
        download
        style={{ display: "inline-block", marginTop: 12, color: "#1677ff", fontWeight: 600 }}
      >
        Open / Download file
      </a>
    </div>
  );
};

export const isImageFilePath = (filePath: string): boolean =>
  getFileKind(filePath) === "image";

export const downloadFilePath = async (filePath: string): Promise<void> => {
  const fileName = filePath.split("?")[0].split("/").pop() || "attachment";
  const triggerDownload = (href: string) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = href;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("Unable to download file");
    const blobUrl = URL.createObjectURL(await response.blob());
    triggerDownload(blobUrl);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // If the file host blocks cross-origin fetches, let the browser handle
    // the signed file URL directly.
    triggerDownload(filePath);
  }
};
