using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages;

public sealed class IndexModel(IMarkdownContentService content) : PageModel
{
    public IReadOnlyList<ContentItem> FeaturedProjects { get; private set; } = [];

    public IReadOnlyList<ContentItem> LatestPosts { get; private set; } = [];

    public async Task OnGetAsync()
    {
        FeaturedProjects = (await content.GetProjectsAsync())
            .Where(project => project.Featured)
            .Take(2)
            .ToArray();
        LatestPosts = (await content.GetPostsAsync()).Take(2).ToArray();
    }
}
