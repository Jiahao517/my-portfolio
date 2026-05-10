import { appendFile, mkdir, readFile, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";
import type { AnalyticsChatRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "analytics");
const CHAT_FILE = path.join(DATA_DIR, "chats.jsonl");
const MAX_CHAT_BYTES = 1024 * 1024 * 12;
const ROTATE_CHAT_BYTES = 1024 * 1024 * 50;

let ensureDirPromise: Promise<void> | undefined;
let writeQueue: Promise<unknown> = Promise.resolve();

export async function appendChatRecord(record: AnalyticsChatRecord) {
  const line = `${JSON.stringify(record)}\n`;
  const next = writeQueue.then(async () => {
    await ensureDataDir();
    await rotateIfNeeded();
    await appendFile(CHAT_FILE, line, "utf8");
  });
  writeQueue = next.catch(() => undefined);
  await next;
}

export interface ChatReadOptions {
  visitorId?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export async function readChatRecords(options: ChatReadOptions = {}): Promise<AnalyticsChatRecord[]> {
  const records = await readAll();
  const fromTs = options.from ? new Date(options.from).getTime() : -Infinity;
  const toTs = options.to ? new Date(options.to).getTime() : Infinity;

  const filtered = records.filter((record) => {
    if (options.visitorId && record.visitorId !== options.visitorId) return false;
    const ts = new Date(record.timestamp).getTime();
    return ts >= fromTs && ts <= toTs;
  });

  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  if (typeof options.limit === "number") return filtered.slice(0, options.limit);
  return filtered;
}

async function readAll(): Promise<AnalyticsChatRecord[]> {
  const chunks: string[] = [];
  for (const file of [`${CHAT_FILE}.1`, CHAT_FILE]) {
    try {
      chunks.push(await readFile(file, "utf8"));
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") continue;
      throw error;
    }
  }
  const content = chunks.join("");
  const sliced = content.length > MAX_CHAT_BYTES ? content.slice(-MAX_CHAT_BYTES) : content;
  return sliced
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as AnalyticsChatRecord];
      } catch {
        return [];
      }
    });
}

async function ensureDataDir() {
  ensureDirPromise ??= mkdir(DATA_DIR, { recursive: true })
    .then(() => undefined)
    .catch((error) => {
      ensureDirPromise = undefined;
      throw error;
    });
  await ensureDirPromise;
}

async function rotateIfNeeded() {
  try {
    const fileStat = await stat(CHAT_FILE);
    if (fileStat.size < ROTATE_CHAT_BYTES) return;
    const rotated = `${CHAT_FILE}.1`;
    try {
      await unlink(rotated);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
    await rename(CHAT_FILE, rotated);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
    throw error;
  }
}
