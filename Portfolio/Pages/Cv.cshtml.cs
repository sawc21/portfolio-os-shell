using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Catalog;
using Portfolio.Profile;

namespace Portfolio.Pages;

public sealed class CvModel(IPortfolioProfileService profileService, IPortfolioCatalogService catalogService) : PageModel
{
    public PortfolioProfile Profile { get; private set; } = new();
    public PortfolioCatalog Catalog { get; private set; } = new();

    public void OnGet()
    {
        Profile = profileService.GetProfile();
        Catalog = catalogService.GetCatalog();
    }
}
