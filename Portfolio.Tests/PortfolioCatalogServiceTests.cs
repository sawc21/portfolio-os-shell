using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Portfolio.Catalog;

namespace Portfolio.Tests;

public sealed class PortfolioCatalogServiceTests : IDisposable
{
    private readonly string _root = Path.Combine(Path.GetTempPath(), $"portfolio-catalog-{Guid.NewGuid():N}");

    [Fact]
    public void GetCatalog_ReadsProjectsPublicationsAndCv()
    {
        Directory.CreateDirectory(Path.Combine(_root, "Content", "Profile"));
        File.WriteAllText(
            Path.Combine(_root, "Content", "Profile", "portfolio-catalog.json"),
            """
            {
              "projects": [
                {
                  "title": "QuickBooksToolKit",
                  "slug": "quickbooks-toolkit",
                  "summary": "QuickBooks Online automation service with integration tools.",
                  "phase": "active",
                  "role": "Backend + tool integration",
                  "tags": ["QuickBooks", "Integration"],
                  "branches": ["OAuth", "Integration"],
                  "sourceType": "github",
                  "localPathLabel": "source/repos/QuickBooksToolKit",
                  "featured": true,
                  "archive": false
                }
              ],
              "publications": [
                {
                  "title": "Semantic Chunking and Consensus Filtering for Structured Extraction of Cyber Threat Intelligence.",
                  "category": "Cybersecurity research",
                  "sourceContext": "DoD funded research",
                  "status": "Resume-listed publication",
                  "tags": ["Cyber Threat Intelligence"],
                  "citationNote": "Citation link pending verification."
                }
              ],
              "cv": {
                "education": ["Angelo State University - B.S. Computer Science, expected January 2028"],
                "researchRoles": ["DoD funded research contributor"],
                "industryExperience": ["Intellivega software developer"],
                "technicalStrengths": ["Knowledge graph construction"],
                "honors": ["Published Research Author"]
              }
            }
            """);

        var service = new JsonPortfolioCatalogService(new TestEnvironment(_root));
        var catalog = service.GetCatalog();

        Assert.Equal("QuickBooksToolKit", catalog.Projects.Single().Title);
        Assert.True(catalog.Projects.Single().Featured);
        Assert.Contains("Semantic Chunking", catalog.Publications.Single().Title);
        Assert.Contains("Published Research Author", catalog.Cv.Honors);
    }

    public void Dispose()
    {
        if (Directory.Exists(_root))
        {
            Directory.Delete(_root, recursive: true);
        }
    }

    private sealed class TestEnvironment(string contentRootPath) : IWebHostEnvironment
    {
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "Portfolio.Tests";
        public string WebRootPath { get; set; } = contentRootPath;
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = contentRootPath;
        public IFileProvider ContentRootFileProvider { get; set; } = new PhysicalFileProvider(contentRootPath);
    }
}
