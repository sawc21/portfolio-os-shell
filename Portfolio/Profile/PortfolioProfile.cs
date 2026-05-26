namespace Portfolio.Profile;

public sealed record PortfolioProfile
{
    public string Name { get; init; } = string.Empty;
    public string Headline { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public PortfolioProfileLinks Links { get; init; } = new();
    public string[] TargetRoles { get; init; } = [];
    public string ShortPitch { get; init; } = string.Empty;
    public string ValueProposition { get; init; } = string.Empty;
    public string[] Skills { get; init; } = [];
    public string[] SystemCapabilities { get; init; } = [];
    public string[] ProjectHighlights { get; init; } = [];
    public string[] WorkHighlights { get; init; } = [];
}

public sealed record PortfolioProfileLinks
{
    public string GitHub { get; init; } = string.Empty;
    public string LinkedIn { get; init; } = string.Empty;
    public string X { get; init; } = string.Empty;
    public string ResumePage { get; init; } = "/resume";
    public string ResumePdf { get; init; } = "/files/sawyer-cawthon-resume.pdf";
}
