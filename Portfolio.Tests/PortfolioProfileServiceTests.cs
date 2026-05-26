using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Portfolio.Profile;

namespace Portfolio.Tests;

public sealed class PortfolioProfileServiceTests : IDisposable
{
    private readonly string _root = Path.Combine(Path.GetTempPath(), $"portfolio-profile-{Guid.NewGuid():N}");

    [Fact]
    public void GetProfile_ReadsCanonicalProfileJson()
    {
        Directory.CreateDirectory(Path.Combine(_root, "Content", "Profile"));
        File.WriteAllText(
            Path.Combine(_root, "Content", "Profile", "portfolio-profile.json"),
            """
            {
              "name": "Sawyer Cawthon",
              "headline": "Software developer",
              "email": "sawyer.cawthon@gmail.com",
              "links": {
                "github": "https://github.com/sawc21",
                "linkedin": "https://www.linkedin.com/in/sawyer-cawthon-a87560287/",
                "x": "https://x.com/sawyerc_cs",
                "resumePage": "/resume",
                "resumePdf": "/files/sawyer-cawthon-resume.pdf"
              },
              "targetRoles": ["Software Engineering Intern"],
              "shortPitch": "Builds product systems.",
              "valueProposition": "Can wire project ideas into useful portfolio software.",
              "skills": ["C#", "ASP.NET Core", "React"],
              "systemCapabilities": ["Workflow design"],
              "projectHighlights": ["Portfolio OS"],
              "workHighlights": ["NASA/Barrios DataMine research assistant"]
            }
            """);

        var service = new JsonPortfolioProfileService(new TestEnvironment(_root));
        var profile = service.GetProfile();

        Assert.Equal("Sawyer Cawthon", profile.Name);
        Assert.Equal("https://github.com/sawc21", profile.Links.GitHub);
        Assert.Equal("/files/sawyer-cawthon-resume.pdf", profile.Links.ResumePdf);
        Assert.Contains("Workflow design", profile.SystemCapabilities);
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
