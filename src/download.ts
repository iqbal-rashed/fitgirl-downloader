import axios, { AxiosRequestConfig } from "axios";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

export type DownloadProgress = {
  downloadedBytes: number;
  totalBytes?: number;
  percent?: number; // 0-100 if totalBytes known
  rateBps?: number; // bytes/sec (approx)
};

function ensureDirForFile(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function extractFilenameFromContentDisposition(contentDisposition: string): string | null {
  if (!contentDisposition) return null;

  // Handle UTF-8 encoded filenames (e.g., filename*=UTF-8''%D0%A4%D0%B0%D0%B9%D0%BB.rar)
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;,\s]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  // Handle standard filename parameter (e.g., filename="file.rar" or filename=file.rar)
  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
  if (filenameMatch?.[1]) {
    return filenameMatch[1].replace(/['"]/g, "");
  }

  return null;
}

export async function downloadFileWithProgress(
  url: string,
  outputDir: string,
  onProgress?: (p: DownloadProgress) => void,
  config: AxiosRequestConfig = {}
) {
  const res = await axios.get(url, {
    responseType: "stream",
    // optional defaults you can override via `config`
    maxRedirects: 10,
    timeout: 0,
    ...config,
  });

  // Extract filename from Content-Disposition header
  let filename = extractFilenameFromContentDisposition(res.headers["content-disposition"] ?? "");

  // Fallback to URL pathname if no filename in header
  if (!filename) {
    filename = path.basename(new URL(url).pathname);
  }

  const outputPath = path.join(outputDir, filename);
  ensureDirForFile(outputPath);

  // Check if file already exists and skip
  if (fs.existsSync(outputPath)) {
    console.log(`File already exists, skipping: ${filename}`);
    res.data.destroy();
    return outputPath;
  }

  // Download to temporary .download file
  const tempPath = `${outputPath}.download`;

  // Clean up any existing incomplete download
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  const totalBytesHeader = res.headers["content-length"];
  const totalBytes =
    typeof totalBytesHeader === "string" ? Number(totalBytesHeader) : undefined;

  let downloadedBytes = 0;

  // For rate calculation (throttled)
  let lastEmit = Date.now();
  let lastBytes = 0;

  res.data.on("data", (chunk: Buffer) => {
    downloadedBytes += chunk.length;

    const now = Date.now();
    const dt = (now - lastEmit) / 1000;

    // throttle progress callback a bit (4x/sec)
    if (dt >= 0.25) {
      const rateBps = (downloadedBytes - lastBytes) / dt;
      lastEmit = now;
      lastBytes = downloadedBytes;

      const percent = totalBytes
        ? (downloadedBytes / totalBytes) * 100
        : undefined;

      onProgress?.({
        downloadedBytes,
        totalBytes,
        percent,
        rateBps,
      });
    }
  });

  // Download to temporary file
  await pipeline(res.data, fs.createWriteStream(tempPath));

  // Rename to final filename after successful download
  fs.renameSync(tempPath, outputPath);

  // final emit
  onProgress?.({
    downloadedBytes,
    totalBytes,
    percent: totalBytes ? 100 : undefined,
    rateBps: undefined,
  });

  return outputPath;
}

// --- Example usage ---
function fmtBytes(n: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function fmtRate(bps?: number) {
  return bps ? `${fmtBytes(bps)}/s` : "";
}
