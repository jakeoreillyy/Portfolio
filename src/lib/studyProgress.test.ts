import { describe, expect, it } from "vitest";
import { END, START, at, yearOfStudy } from "./studyProgress";

// Months are 1-based here, unlike Date's, so each date reads as written.
const day = (year: number, month: number, date: number) => new Date(year, month - 1, date);

describe("yearOfStudy", () => {
  it("is year 1 before the start date", () => {
    expect(yearOfStudy(day(2023, 9, 1))).toBe(1);
    expect(yearOfStudy(day(2024, 8, 31))).toBe(1);
  });

  it("moves up a year at the start of each academic year", () => {
    expect(yearOfStudy(day(2024, 9, 1))).toBe(1);
    expect(yearOfStudy(day(2025, 8, 31))).toBe(1);
    expect(yearOfStudy(day(2025, 9, 1))).toBe(2);
    expect(yearOfStudy(day(2026, 8, 31))).toBe(2);
    expect(yearOfStudy(day(2026, 9, 1))).toBe(3);
    expect(yearOfStudy(day(2027, 8, 31))).toBe(3);
    expect(yearOfStudy(day(2027, 9, 1))).toBe(4);
  });

  it("is the final year through the last month", () => {
    expect(yearOfStudy(day(2028, 5, 1))).toBe(4);
    expect(yearOfStudy(day(2028, 5, 31))).toBe(4);
  });

  it("stays at the final year after the end date", () => {
    expect(yearOfStudy(day(2028, 6, 1))).toBe(4);
    expect(yearOfStudy(day(2028, 9, 1))).toBe(4);
    expect(yearOfStudy(day(2035, 1, 1))).toBe(4);
  });
});

describe("at", () => {
  it("runs from 0 at the start date to 1 at the end date", () => {
    expect(at(START)).toBe(0);
    expect(at(END)).toBe(1);
  });

  it("clamps dates outside the course", () => {
    expect(at(day(2020, 1, 1))).toBe(0);
    expect(at(day(2030, 1, 1))).toBe(1);
  });
});
