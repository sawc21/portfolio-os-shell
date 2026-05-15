import type { PortfolioDataProvider } from "./portfolioDataProvider";

export function createApiPortfolioDataProvider(_baseUrl: string): PortfolioDataProvider {
  throw new Error("API-backed Portfolio OS data is not wired yet. Use mockPortfolioDataProvider for this phase.");
}
