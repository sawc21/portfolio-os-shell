using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages.Projects;

public sealed class DetailsModel(IMarkdownContentService content) : PageModel
{
    public ContentItem Project { get; private set; } = default!;

    public async Task<IActionResult> OnGetAsync(string slug)
    {
        var project = await content.GetProjectBySlugAsync(slug);
        if (project is null)
        {
            return NotFound();
        }

        Project = project;
        return Page();
    }
}

