/**
 * Removes focus from the currently active element.
 * Useful before programmatic navigation to avoid stale focus on mobile.
 */
export function clearFocus() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

