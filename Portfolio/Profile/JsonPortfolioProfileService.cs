using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace Portfolio.Profile;

public sealed class JsonPortfolioProfileService : IPortfolioProfileService
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly Lazy<PortfolioProfile> _profile;

    public JsonPortfolioProfileService(IWebHostEnvironment environment)
    {
        var profilePath = Path.Combine(environment.ContentRootPath, "Content", "Profile", "portfolio-profile.json");
        _profile = new Lazy<PortfolioProfile>(() => LoadProfile(profilePath));
    }

    public PortfolioProfile GetProfile() => _profile.Value;

    private static PortfolioProfile LoadProfile(string profilePath)
    {
        using var stream = File.OpenRead(profilePath);
        var profile = JsonSerializer.Deserialize<PortfolioProfile>(stream, Options);
        return profile ?? throw new InvalidOperationException($"Portfolio profile config is empty: {profilePath}");
    }
}
