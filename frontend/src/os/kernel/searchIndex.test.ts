import { describe, expect, test } from "vitest";
import { mockPortfolioDataProvider } from "../services/mockPortfolioDataProvider";
import { searchPortfolio } from "./searchIndex";

describe("search index", () => {
  test("reuses the built document corpus for the same provider", () => {
    let projectReadCount = 0;
    const provider = {
      ...mockPortfolioDataProvider,
      getProjects: () => {
        projectReadCount += 1;
        return mockPortfolioDataProvider.getProjects();
      }
    };

    searchPortfolio("portfolio", provider);
    searchPortfolio("portfolio", provider);

    expect(projectReadCount).toBe(1);
  });
});
