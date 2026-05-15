namespace Portfolio.Content;

public sealed record ContentItem(
    string Title,
    string Slug,
    string Summary,
    DateOnly Date,
    IReadOnlyList<string> Tags,
    string Html,
    bool Featured = false,
    string? Phase = null,
    string? Role = null,
    string? Visual = null,
    string? VisualAlt = null,
    IReadOnlyList<string>? Branches = null,
    int ReadingTime = 1);
