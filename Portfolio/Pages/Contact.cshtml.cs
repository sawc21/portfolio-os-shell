using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Profile;

namespace Portfolio.Pages;

public sealed class ContactModel(IPortfolioProfileService profileService) : PageModel
{
    public PortfolioProfile Profile { get; private set; } = new();

    public void OnGet()
    {
        Profile = profileService.GetProfile();
    }

    public string DisplayUrl(string href)
    {
        return href
            .Replace("https://", string.Empty, StringComparison.OrdinalIgnoreCase)
            .Replace("http://", string.Empty, StringComparison.OrdinalIgnoreCase)
            .TrimEnd('/');
    }
}
