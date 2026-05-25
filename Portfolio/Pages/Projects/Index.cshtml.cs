using Microsoft.AspNetCore.Mvc.RazorPages;
using Portfolio.Catalog;

namespace Portfolio.Pages.Projects;

public sealed class IndexModel(IPortfolioCatalogService catalogService) : PageModel
{
    public IReadOnlyList<CatalogProject> Projects { get; private set; } = [];

    public void OnGet()
    {
        Projects = catalogService.GetCatalog().Projects;
    }
}

