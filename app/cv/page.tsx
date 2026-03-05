import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
};

const mdToHtml = (md: string): string => {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  const inline = (text: string): string =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const escape = (text: string): string =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h3>${escape(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h2>${escape(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h1>${escape(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (line.trim() === "") {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<p>${inline(line)}</p>`);
    }
  }

  if (inList) out.push("</ul>");
  return out.join("\n");
};

const CvPage = () => {
  const md = process.env.CV_CONTENT ?? "";
  const html = mdToHtml(md);

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:px-8 md:py-16">
        <a
          href="/"
          className="mb-8 inline-flex w-fit items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
        >
          &larr; Back
        </a>
        <article
          className="cv-article"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default CvPage;
