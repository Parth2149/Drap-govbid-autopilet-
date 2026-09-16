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

  const html2pdf = (await import("html2pdf.js")).default;

  const opt = {
    margin: 0.5,
    filename: "GovBid_Proposal.pdf",
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
  };

  await html2pdf().set(opt).from(element).save();
}

