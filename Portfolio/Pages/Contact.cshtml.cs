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

    public static string PhoneHref(string phone)
    {
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        return digits.Length == 10 ? $"tel:+1{digits}" : $"tel:{phone}";
    }

    public static string LocationHref(string location)
    {
        return $"https://www.google.com/maps/search/?api=1&query={Uri.EscapeDataString(location)}";
    }
}
