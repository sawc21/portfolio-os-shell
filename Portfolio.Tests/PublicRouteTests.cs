using Microsoft.AspNetCore.Mvc.Testing;

namespace Portfolio.Tests;

public sealed class PublicRouteTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PublicRouteTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Theory]
    [InlineData("/")]
    [InlineData("/projects")]
    [InlineData("/projects/portfolio-platform")]
    [InlineData("/blog")]
    [InlineData("/blog/starting-the-portfolio")]
    [InlineData("/resume")]
    [InlineData("/cv")]
    [InlineData("/contact")]
    public async Task CorePages_ReturnSuccessfulResponses(string path)
    {
        var response = await _client.GetAsync(path);

        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Homepage_IncludesPortfolioOperatingSystemMount()
    {
        var homepage = await _client.GetStringAsync("/");

        Assert.Contains("Skip to content", homepage);
        Assert.Contains("property=\"og:image\"", homepage);
        Assert.Contains("portfolio-os-page", homepage);
        Assert.Contains("data-portfolio-os", homepage);
        Assert.Contains("Portfolio operating system", homepage);
        Assert.Contains("href=\"/projects\"", homepage);
        Assert.Contains("href=\"/blog\"", homepage);
        Assert.Contains("href=\"/resume\"", homepage);
        Assert.Contains("href=\"/cv\"", homepage);
        Assert.Contains("href=\"/contact\"", homepage);
        Assert.Contains("About", homepage);
        Assert.Contains("Skills", homepage);
        Assert.Contains("Case Studies", homepage);
        Assert.Contains("Publications &amp; CV", homepage);
        Assert.Contains("Sawyer Search", homepage);
        Assert.Contains("Recruiter Quick View", homepage);
        Assert.Contains("Hire Sawyer Cawthon", homepage);
        Assert.Contains("Launch World", homepage);
        Assert.Contains("/dist/portfolio-os.js", homepage);
        Assert.DoesNotContain("site-header", homepage);
        Assert.DoesNotContain("branch-section", homepage);
        Assert.DoesNotContain("log-section", homepage);
    }

    [Fact]
    public async Task BlogArticle_IncludesArticleMetadata()
    {
        var article = await _client.GetStringAsync("/blog/starting-the-portfolio");

        Assert.Contains("property=\"og:type\" content=\"article\"", article);
        Assert.Contains("property=\"article:published_time\"", article);
        Assert.Contains("aria-current=\"page\"", article);
    }

    [Fact]
    public async Task Sitemap_IncludesPublicContentRoutes()
    {
        var sitemap = await _client.GetStringAsync("/sitemap.xml");

        Assert.Contains("/projects/portfolio-platform", sitemap);
        Assert.Contains("/blog/starting-the-portfolio", sitemap);
        Assert.Contains("/cv", sitemap);
    }

    [Fact]
    public async Task CvPage_IncludesResearchPublicationsAndResumeDownload()
    {
        var cv = await _client.GetStringAsync("/cv");

        Assert.Contains("Sawyer Cawthon", cv);
        Assert.Contains("linkedin.com/in/sawyer-cawthon-a87560287", cv);
        Assert.Contains("github.com/sawc21", cv);
        Assert.Contains("Semantic Chunking and Consensus Filtering", cv);
        Assert.Contains("Automated Validation and Repair", cv);
        Assert.Contains("NASA/Barrios", cv);
        Assert.Contains("Download resume PDF", cv);
    }

    [Fact]
    public async Task ProjectsPage_IncludesCatalogBackedFeaturedProjects()
    {
        var projects = await _client.GetStringAsync("/projects");

        Assert.Contains("QuickBooksToolKit", projects);
        Assert.Contains("NoteTakingApp", projects);
        Assert.Contains("Inventory Management", projects);
    }

    [Fact]
    public async Task RobotsTxt_PointsToSitemap()
    {
        var robots = await _client.GetStringAsync("/robots.txt");

        Assert.Contains("User-agent: *", robots);
        Assert.Contains("Sitemap: /sitemap.xml", robots);
    }

    [Fact]
    public async Task RssFeed_IncludesIntroductoryBlogPost()
    {
        var feed = await _client.GetStringAsync("/feed.xml");

        Assert.Contains("Starting the Portfolio", feed);
        Assert.Contains("/blog/starting-the-portfolio", feed);
    }
}
