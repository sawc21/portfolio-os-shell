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
    [InlineData("/contact")]
    public async Task CorePages_ReturnSuccessfulResponses(string path)
    {
        var response = await _client.GetAsync(path);

        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Sitemap_IncludesPublicContentRoutes()
    {
        var sitemap = await _client.GetStringAsync("/sitemap.xml");

        Assert.Contains("/projects/portfolio-platform", sitemap);
        Assert.Contains("/blog/starting-the-portfolio", sitemap);
    }

    [Fact]
    public async Task RssFeed_IncludesIntroductoryBlogPost()
    {
        var feed = await _client.GetStringAsync("/feed.xml");

        Assert.Contains("Starting the Portfolio", feed);
        Assert.Contains("/blog/starting-the-portfolio", feed);
    }
}
