using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages.Blog;

public sealed class IndexModel(IMarkdownContentService content) : PageModel
{
    public IReadOnlyList<ContentItem> Posts { get; private set; } = [];

    public async Task OnGetAsync()
    {
        Posts = await content.GetPostsAsync();
    }
}

