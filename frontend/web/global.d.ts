import type { jspdf } from "jspdf";

declare global {
  interface Window {
    jsPDF: typeof jsPDF;
  }
}
