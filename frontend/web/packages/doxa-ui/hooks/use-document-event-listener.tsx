import { useEffect, useCallback } from "react";

/**
 * A custom hook that adds an event listener to the document and automatically
 * removes it on component unmount.
 *
 * @param eventName - The name of the event to listen for (e.g., 'click', 'keydown')
 * @param handler - The event handler callback function
 * @param options - Optional AddEventListenerOptions or boolean for useCapture
 * 
 * // Example usage:

function MyComponent() {
  useDocumentEventListener('click', (e) => {
    console.info('Document clicked at:', e.clientX, e.clientY);
  });

  useDocumentEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Handle escape key
    }
  });

  return <div>My Component</div>;
}

 */
export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  // Memoize the handler to prevent unnecessary re-renders
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    document.addEventListener(
      eventName,
      memoizedHandler as EventListener,
      options
    );

    return () => {
      document.removeEventListener(
        eventName,
        memoizedHandler as EventListener,
        options
      );
    };
  }, [eventName, memoizedHandler, options]);
}
