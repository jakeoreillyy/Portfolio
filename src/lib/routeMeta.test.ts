import { describe, expect, it } from "vitest";
import { ROUTE_META, metaForPath, normalizePath } from "./routeMeta";

describe("normalizePath", () => {
  it.each([
    ["/", "/"],
    ["/contact", "/contact"],
    ["/contact/", "/contact"],
    ["/contact///", "/contact"],
    ["//", "/"],
  ])("normalizes %s to %s", (path, expected) => {
    expect(normalizePath(path)).toBe(expected);
  });
});

describe("metaForPath", () => {
  it("returns each route's own metadata", () => {
    expect(metaForPath("/")).toBe(ROUTE_META["/"]);
    expect(metaForPath("/contact")).toBe(ROUTE_META["/contact"]);
  });

  it("ignores trailing slashes", () => {
    expect(metaForPath("/contact/")).toBe(ROUTE_META["/contact"]);
  });

  it("falls back to the home metadata for unknown paths", () => {
    expect(metaForPath("/missing")).toBe(ROUTE_META["/"]);
    expect(metaForPath("/contact/extra")).toBe(ROUTE_META["/"]);
  });
});
