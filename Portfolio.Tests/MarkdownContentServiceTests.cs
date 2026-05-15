using Portfolio.Content;

namespace Portfolio.Tests;

public sealed class MarkdownContentServiceTests : IDisposable
{
    private readonly string _contentRoot = Path.Combine(Path.GetTempPath(), $"portfolio-content-{Guid.NewGuid():N}");

    [Fact]
    public async Task GetPostsAsync_LoadsFrontMatterRendersMarkdownAndOrdersNewestFirst()
    {
        WriteContent("Blog", "older.md", """
            ---
            title: Older entry
            slug: older-entry
            summary: A previous note.
            date: 2026-01-10
            tags: ASP.NET, Hosting
            ---
            # Older entry

            This is **rendered** markdown.
            """);
        WriteContent("Blog", "newer.md", """
            ---
            title: Newer entry
            slug: newer-entry
            summary: A newer note.
            date: 2026-03-05
            tags: C#, Portfolio
            readingTime: 9
            ---
            # Newer entry

            This is the latest update.
            """);

        var service = new MarkdownContentService(_contentRoot);

        var posts = await service.GetPostsAsync();

        Assert.Collection(
            posts,
            newest =>
            {
                Assert.Equal("newer-entry", newest.Slug);
                Assert.Equal(new DateOnly(2026, 3, 5), newest.Date);
                Assert.Contains("Portfolio", newest.Tags);
                Assert.Equal(9, newest.ReadingTime);
            },
            older =>
            {
                Assert.Equal("older-entry", older.Slug);
                Assert.Contains("<strong>rendered</strong>", older.Html);
            });
    }

    [Fact]
    public async Task GetProjectBySlugAsync_ReturnsMatchingProject()
    {
        WriteContent("Projects", "case-study.md", """
            ---
            title: Portfolio Platform
            slug: portfolio-platform
            summary: A Razor Pages portfolio with content files.
            date: 2026-05-14
            tags: ASP.NET, Razor Pages
            featured: true
            phase: prototype
            role: Product design + ASP.NET
            visual: /images/projects/kernel-gallery.svg
            visualAlt: Isometric kernel gallery preview
            branches: identity system|content engine|deployment path
            ---
            # Portfolio Platform

            Built with C# and Markdown content.
            """);

        var service = new MarkdownContentService(_contentRoot);

        var project = await service.GetProjectBySlugAsync("portfolio-platform");

        Assert.NotNull(project);
        Assert.Equal("Portfolio Platform", project.Title);
        Assert.True(project.Featured);
        Assert.Equal("prototype", project.Phase);
        Assert.Equal("Product design + ASP.NET", project.Role);
        Assert.Equal("/images/projects/kernel-gallery.svg", project.Visual);
        Assert.Equal("Isometric kernel gallery preview", project.VisualAlt);
        Assert.Equal(["identity system", "content engine", "deployment path"], project.Branches);
        Assert.Contains("Razor Pages", project.Tags);
        Assert.Contains("<h1", project.Html);
    }

    [Fact]
    public async Task GetProjectsAsync_OrdersFeaturedProjectsBeforeNonFeaturedProjects()
    {
        WriteContent("Projects", "non-featured.md", """
            ---
            title: Newer Non Featured
            slug: newer-non-featured
            summary: Newer but not featured.
            date: 2026-05-20
            tags: C#
            featured: false
            ---
            # Newer Non Featured
            """);
        WriteContent("Projects", "featured.md", """
            ---
            title: Older Featured
            slug: older-featured
            summary: Older and featured.
            date: 2026-01-01
            tags: Design
            featured: true
            ---
            # Older Featured
            """);

        var service = new MarkdownContentService(_contentRoot);

        var projects = await service.GetProjectsAsync();

        Assert.Equal("older-featured", projects[0].Slug);
        Assert.Equal("newer-non-featured", projects[1].Slug);
    }

    [Fact]
    public async Task GetPostsAsync_ComputesReadingTimeWhenFrontMatterOmitsIt()
    {
        var words = string.Join(' ', Enumerable.Repeat("word", 420));
        WriteContent("Blog", "computed.md", $"""
            ---
            title: Computed Reading Time
            slug: computed-reading-time
            summary: A long note.
            date: 2026-04-01
            tags: Writing
            ---
            # Computed Reading Time

            {words}
            """);

        var service = new MarkdownContentService(_contentRoot);

        var post = Assert.Single(await service.GetPostsAsync());

        Assert.Equal(2, post.ReadingTime);
    }

    private void WriteContent(string section, string fileName, string content)
    {
        var directory = Path.Combine(_contentRoot, section);
        Directory.CreateDirectory(directory);
        File.WriteAllText(Path.Combine(directory, fileName), content.Replace("\r\n", "\n"));
    }

    public void Dispose()
    {
        if (Directory.Exists(_contentRoot))
        {
            Directory.Delete(_contentRoot, recursive: true);
        }
    }
}
