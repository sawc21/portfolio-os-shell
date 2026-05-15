using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages;

public sealed class ResumeModel(IMarkdownContentService content) : PageModel
{
    public ContentItem? Resume { get; private set; }

    public async Task OnGetAsync()
    {
        Resume = await content.GetResumeAsync();
    }
}

