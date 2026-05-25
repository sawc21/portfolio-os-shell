namespace Portfolio.Catalog;

public sealed class PortfolioCatalog
{
    public IReadOnlyList<CatalogProject> Projects { get; init; } = [];
    public IReadOnlyList<PublicationItem> Publications { get; init; } = [];
    public CvProfile Cv { get; init; } = new();
}

public sealed class CatalogProject
{
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Phase { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public IReadOnlyList<string> Tags { get; init; } = [];
    public IReadOnlyList<string> Branches { get; init; } = [];
    public string SourceType { get; init; } = string.Empty;
    public string? RepoUrl { get; init; }
    public string LocalPathLabel { get; init; } = string.Empty;
    public bool Featured { get; init; }
    public bool Archive { get; init; }
    public string? CaseStudyPath { get; init; }
    public ProjectVisualProof? VisualProof { get; init; }
    public IReadOnlyList<ProjectProofSlot> ProofSlots { get; init; } = [];
}

public sealed class ProjectVisualProof
{
    public string Kind { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string Alt { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}

public sealed class ProjectProofSlot
{
    public string Label { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}

public sealed class PublicationItem
{
    public string Title { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string SourceContext { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public IReadOnlyList<string> Tags { get; init; } = [];
    public string CitationNote { get; init; } = string.Empty;
    public string CitationStatus { get; init; } = string.Empty;
    public string VenueStatus { get; init; } = string.Empty;
    public string DoiStatus { get; init; } = string.Empty;
    public string PdfStatus { get; init; } = string.Empty;
    public string? Url { get; init; }
}

public sealed class CvProfile
{
    public IReadOnlyList<string> Education { get; init; } = [];
    public IReadOnlyList<string> ResearchRoles { get; init; } = [];
    public IReadOnlyList<string> IndustryExperience { get; init; } = [];
    public IReadOnlyList<string> TechnicalStrengths { get; init; } = [];
    public IReadOnlyList<string> Honors { get; init; } = [];
}
