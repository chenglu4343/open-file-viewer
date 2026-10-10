/** A reading position tied to a page, rather than the old document's height. */
export type PageScrollAnchor = { index: number; fraction: number };

export function capturePageScrollAnchor(
  scroller: HTMLElement,
  pages: readonly HTMLElement[]
): PageScrollAnchor | undefined {
  if (scroller.scrollTop <= 0) return undefined;
  const top = scroller.getBoundingClientRect().top + scroller.clientTop;
  for (let index = 0; index < pages.length; index += 1) {
    const rect = pages[index].getBoundingClientRect();
    if (rect.height > 0 && rect.bottom > top) {
      return { index, fraction: (top - rect.top) / rect.height };
    }
  }
  return undefined;
}

export function restorePageScrollAnchor(
  scroller: HTMLElement,
  pages: readonly HTMLElement[],
  anchor: PageScrollAnchor | undefined
): void {
  if (!anchor) return;
  const page = pages[anchor.index];
  if (!page) return;
  const rect = page.getBoundingClientRect();
  if (rect.height <= 0) return;
  const top = scroller.getBoundingClientRect().top + scroller.clientTop;
  scroller.scrollTop = Math.max(0, scroller.scrollTop + rect.top - top + anchor.fraction * rect.height);
}
