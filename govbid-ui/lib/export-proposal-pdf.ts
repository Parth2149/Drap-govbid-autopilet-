/**
 * Client-side PDF via jsPDF text layout (reliable; html2canvas often yields blank pages
 * with off-screen nodes and Tailwind v4 oklch colors).
 */
export async function exportProposalPdf(textContent: string): Promise<void> {
  const body = textContent.trim();
  if (!body) {
    throw new Error("No proposal content to export");
  }

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 6;
  let y = margin;

  function ensureSpace(blockHeight: number) {
    if (y + blockHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(157, 23, 77);
  const titleLines = doc.splitTextToSize("GovBid AI — Proposal Draft", maxWidth);
  ensureSpace(titleLines.length * lineHeight + 4);
  doc.text(titleLines, margin, y);
  y += titleLines.length * lineHeight + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(55, 65, 81);

  const paragraphs = body.split(/\n{2,}/);
  for (const paragraph of paragraphs) {
    const lines = doc.splitTextToSize(paragraph.replace(/\n/g, " ").trim(), maxWidth);
    if (!lines.length) continue;
    ensureSpace(lines.length * lineHeight);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 2;
  }

  doc.save("GovBid_Proposal.pdf");
}
