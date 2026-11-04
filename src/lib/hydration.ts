import { useSyncExternalStore } from "react";

// The answer only changes once, when hydration finishes, so there's nothing to
// listen to.
const subscribe = () => () => {};

// Whether render may use values that only exist in the browser, such as the
// date or a media query. The built pages are prerendered in Node, and the
// client render that hydrates them must produce exactly the same markup. So
// this is false in both of those, then true on every render after, and from
// the start when there's no markup to hydrate (the dev server).
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

// Built from calendar parts, so its year and month read the same in every
// time zone, wherever the prerender ran and wherever the visitor is.
const BUILD_DATE = new Date(...__BUILD_DATE__);

// Today's date, or the day the site was built until hydration is done.
export function useToday() {
  return useHydrated() ? new Date() : BUILD_DATE;
}
