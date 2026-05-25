using System.Text.Json;

namespace Portfolio.Catalog;

public sealed class JsonPortfolioCatalogService(IWebHostEnvironment environment) : IPortfolioCatalogService
{
    private readonly Lazy<PortfolioCatalog> _catalog = new(() =>
    {
        var path = Path.Combine(environment.ContentRootPath, "Content", "Profile", "portfolio-catalog.json");
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<PortfolioCatalog>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new PortfolioCatalog();
    });

    public PortfolioCatalog GetCatalog()
    {
        return _catalog.Value;
    }
}
