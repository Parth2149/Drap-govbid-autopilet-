/**
 * Client-side PDF export using html2pdf.js targeting the DOM node with rendered markdown & tables.
 */
export async function exportProposalPdf(
  target?: HTMLElement | string | null
): Promise<void> {
  const element =
    (typeof target === "string"
      ? document.getElementById(target)
      : target) ||
    (typeof document !== "undefined"
      ? document.getElementById("pdf-export-container")
      : null);

  if (!element) {
    throw new Error("No element found for PDF export");
  }

  if (typeof window !== "undefined") {
    const html2canvasPro = (await import("html2canvas-pro")).default;
    (window as unknown as { html2canvas: typeof html2canvasPro }).html2canvas =
      html2canvasPro;
  }

  const html2pdf = (await import("html2pdf.js")).default;

  const opt = {
    margin: 0.5,
    filename: "Drapbid_Proposal.pdf",
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      avoid: ["tr", "table", "h1", "h2", "h3", ".avoid-break"],
    },
  };

  await html2pdf().set(opt).from(element).save();
}

