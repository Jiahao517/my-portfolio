import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export type CaseImage = {
  src: string;
  width: number;
  height: number;
  ar: number;
};

export function caseImages(caseSlug: string, count: number) {
  return Array.from({ length: count }, (_, index) => caseImage(caseSlug, index + 1));
}

export function caseImage(caseSlug: string, index: number): CaseImage {
  const number = String(index).padStart(2, "0");
  const publicPath = `/case-images/${caseSlug}/${number}.png`;
  const dimensions = readPngDimensions(publicPathToFilePath(publicPath));
  return {
    src: withFileVersion(publicPath),
    width: dimensions.width,
    height: dimensions.height,
    ar: dimensions.width / dimensions.height,
  };
}

function withFileVersion(publicPath: string) {
  const filePath = publicPathToFilePath(publicPath);
  try {
    const stat = fs.statSync(filePath);
    return `${publicPath}?v=${Math.floor(stat.mtimeMs)}`;
  } catch {
    return publicPath;
  }
}

function publicPathToFilePath(publicPath: string) {
  const [pathname] = publicPath.split("?");
  return path.join(PUBLIC_DIR, pathname.replace(/^\/+/, ""));
}

function readPngDimensions(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  } catch {
    return { width: 1920, height: 1080 };
  }
}
