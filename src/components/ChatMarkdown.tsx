import type { ReactNode } from "react";

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

type ListItem = { text: string };

type FollowUpSection = {
  content: string;
  questions: string[];
};

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={`${match.index}-code`}>{token.slice(1, -1)}</code>);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderText(text: string): ReactNode[] {
  return text.split("\n").flatMap((line, index) => (
    index === 0
      ? renderInline(line)
      : [<br key={`${index}-br`} />, ...renderInline(line)]
  ));
}

function extractFollowUps(content: string): FollowUpSection {
  const followUpPattern = /(?:^|\n)<followups>\s*([\s\S]*?)(?:\n<\/followups>|$)/i;
  const match = content.match(followUpPattern);
  if (!match) return { content, questions: [] };

  const questions = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    content: content.replace(followUpPattern, "").trimEnd(),
    questions,
  };
}

function parseMarkdown(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split(/\r?\n/);
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: ListItem[] = [];
  let pendingBlankInList = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) {
      blocks.push({ type: listType, items: listItems.map((item) => item.text) });
    }
    listType = null;
    listItems = [];
    pendingBlankInList = false;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      if (listType && listItems.length > 0) {
        pendingBlankInList = true;
      } else {
        flushParagraph();
      }
      continue;
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
      continue;
    }

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push({ text: unordered[1] });
      pendingBlankInList = false;
      continue;
    }

    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push({ text: ordered[1] });
      pendingBlankInList = false;
      continue;
    }

    if (pendingBlankInList && listType && listItems.length > 0) {
      const last = listItems[listItems.length - 1];
      last.text = `${last.text}\n${line}`;
      pendingBlankInList = false;
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function ChatMarkdown({
  content,
  onFollowUpClick,
}: {
  content: string;
  onFollowUpClick?: (question: string) => void;
}) {
  const { content: markdownContent, questions } = extractFollowUps(content);
  const blocks = parseMarkdown(markdownContent);

  return (
    <div className="chat-markdown">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return <h4 key={index}>{renderInline(block.text)}</h4>;
        }
        if (block.type === "hr") {
          return <hr key={index} />;
        }
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderText(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderText(item)}</li>
              ))}
            </ol>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
      {questions.length > 0 && onFollowUpClick ? (
        <div className="chat-markdown__followups" aria-label="推荐追问">
          <span className="chat-markdown__followups-title">你可以继续问</span>
          {questions.map((question) => (
            <button
              key={question}
              type="button"
              className="chat-markdown__followup"
              onClick={() => onFollowUpClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
