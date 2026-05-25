using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Content;
using Portfolio.Profile;

namespace Portfolio.Pages;

public sealed class ResumeModel(IMarkdownContentService content, IPortfolioProfileService profileService) : PageModel
{
    public ContentItem? Resume { get; private set; }
    public PortfolioProfile Profile { get; private set; } = new();

    public async Task OnGetAsync()
    {
        Profile = profileService.GetProfile();
        Resume = await content.GetResumeAsync();
    }
}

