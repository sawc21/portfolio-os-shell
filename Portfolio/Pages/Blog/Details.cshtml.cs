using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;

namespace Portfolio.Pages.Blog;

public sealed class DetailsModel(IMarkdownContentService content) : PageModel
{
    public ContentItem Post { get; private set; } = default!;

    public async Task<IActionResult> OnGetAsync(string slug)
    {
        var post = await content.GetPostBySlugAsync(slug);
        if (post is null)
        {
            return NotFound();
        }

        Post = post;
        return Page();
    }
}

