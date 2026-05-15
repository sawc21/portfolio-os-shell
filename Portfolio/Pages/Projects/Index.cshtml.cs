using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages.Projects;

public sealed class IndexModel(IMarkdownContentService content) : PageModel
{
    public IReadOnlyList<ContentItem> Projects { get; private set; } = [];

    public async Task OnGetAsync()
    {
        Projects = await content.GetProjectsAsync();
    }
}

