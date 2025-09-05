import { useDocumentEventListener } from "./use-document-event-listener";

/**
 * Reacts when a keydown and mousedown occurs on document.
 *
 * ### Example of usage:
 * ```javascript
 */
export function useListenDocumentInteractionOnEscapeKeyAndMouseDown(
  elementsRef: any[],
  cb: () => void
) {
  useDocumentEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      cb();
    }
  });
  useDocumentEventListener("mousedown", (e: MouseEvent) => {
    if (
      elementsRef
        .map((ref) => ref.current && !ref.current.contains(e.target as Node))
        .every((answer) => answer === true)
      //   optionTabRef.current &&
      //   !optionTabRef.current.contains(event.target as Node)
    ) {
      cb();
    }
  });
}
