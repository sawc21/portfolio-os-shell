using System.Globalization;
using System.Text.RegularExpressions;
using Markdig;
using Microsoft.AspNetCore.Hosting;

namespace Portfolio.Content;

public sealed class MarkdownContentService : IMarkdownContentService
{
    private static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder()
        .UseAdvancedExtensions()
        .Build();

    private readonly string _contentRoot;

    public MarkdownContentService(IWebHostEnvironment environment)
        : this(Path.Combine(environment.ContentRootPath, "Content"))
    {
    }

    public MarkdownContentService(string contentRoot)
    {
        _contentRoot = contentRoot;
    }

    public Task<IReadOnlyList<ContentItem>> GetPostsAsync() => LoadSectionAsync("Blog");

    public async Task<ContentItem?> GetPostBySlugAsync(string slug)
    {
        var posts = await GetPostsAsync();
        return posts.FirstOrDefault(post => string.Equals(post.Slug, slug, StringComparison.OrdinalIgnoreCase));
    }

    public Task<IReadOnlyList<ContentItem>> GetProjectsAsync() => LoadSectionAsync("Projects", featuredFirst: true);

    public async Task<ContentItem?> GetProjectBySlugAsync(string slug)
    {
        var projects = await GetProjectsAsync();
        return projects.FirstOrDefault(project => string.Equals(project.Slug, slug, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<ContentItem?> GetResumeAsync()
    {
        var resumes = await LoadSectionAsync("Resume");
        return resumes.FirstOrDefault();
    }

    private async Task<IReadOnlyList<ContentItem>> LoadSectionAsync(string section, bool featuredFirst = false)
    {
        var directory = Path.Combine(_contentRoot, section);
        if (!Directory.Exists(directory))
        {
            return [];
        }

        var files = Directory.EnumerateFiles(directory, "*.md", SearchOption.TopDirectoryOnly);
        var items = new List<ContentItem>();

        foreach (var file in files)
        {
            var source = await File.ReadAllTextAsync(file);
            items.Add(ParseContent(file, source));
        }

        var ordered = featuredFirst
            ? items.OrderByDescending(item => item.Featured).ThenByDescending(item => item.Date)
            : items.OrderByDescending(item => item.Date);

        return ordered
            .ThenBy(item => item.Title, StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    private static ContentItem ParseContent(string filePath, string source)
    {
        var normalized = source.Replace("\r\n", "\n", StringComparison.Ordinal);
        var metadata = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var markdown = normalized;

        if (normalized.StartsWith("---\n", StringComparison.Ordinal))
        {
            var end = normalized.IndexOf("\n---\n", 4, StringComparison.Ordinal);
            if (end < 0)
            {
                throw new InvalidDataException($"Markdown front matter is not closed in {filePath}.");
            }

            var frontMatter = normalized[4..end];
            markdown = normalized[(end + 5)..];

            foreach (var line in frontMatter.Split('\n', StringSplitOptions.RemoveEmptyEntries))
            {
                var separator = line.IndexOf(':', StringComparison.Ordinal);
                if (separator <= 0)
                {
                    throw new InvalidDataException($"Invalid front matter line '{line}' in {filePath}.");
                }

                metadata[line[..separator].Trim()] = line[(separator + 1)..].Trim();
            }
        }

        var title = GetMetadata(metadata, "title", Path.GetFileNameWithoutExtension(filePath));
        var slug = GetMetadata(metadata, "slug", Slugify(title));
        var summary = GetMetadata(metadata, "summary", string.Empty);
        var date = ParseDate(GetMetadata(metadata, "date", "2000-01-01"), filePath);
        var tags = GetMetadata(metadata, "tags", string.Empty)
            .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        var featured = bool.TryParse(GetMetadata(metadata, "featured", "false"), out var parsedFeatured) && parsedFeatured;
        var phase = GetOptionalMetadata(metadata, "phase");
        var role = GetOptionalMetadata(metadata, "role");
        var visual = GetOptionalMetadata(metadata, "visual");
        var visualAlt = GetOptionalMetadata(metadata, "visualAlt");
        var branches = GetMetadata(metadata, "branches", string.Empty)
            .Split('|', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        var readingTime = ParseReadingTime(GetOptionalMetadata(metadata, "readingTime"), markdown);

        return new ContentItem(
            title,
            slug,
            summary,
            date,
            tags,
            Markdown.ToHtml(markdown.Trim(), Pipeline),
            featured,
            phase,
            role,
            visual,
            visualAlt,
            branches,
            readingTime);
    }

    private static string GetMetadata(IReadOnlyDictionary<string, string> metadata, string key, string fallback)
    {
        return metadata.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value)
            ? value
            : fallback;
    }

    private static string? GetOptionalMetadata(IReadOnlyDictionary<string, string> metadata, string key)
    {
        return metadata.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value)
            ? value
            : null;
    }

    private static int ParseReadingTime(string? value, string markdown)
    {
        if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var explicitReadingTime) &&
            explicitReadingTime > 0)
        {
            return explicitReadingTime;
        }

        var wordCount = Regex.Matches(markdown, @"[\p{L}\p{N}']+").Count;
        return Math.Max(1, (int)Math.Ceiling(wordCount / 220d));
    }

    private static DateOnly ParseDate(string value, string filePath)
    {
        if (DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return date;
        }

        throw new InvalidDataException($"Invalid date '{value}' in {filePath}; expected yyyy-MM-dd.");
    }

    private static string Slugify(string value)
    {
        var chars = value
            .ToLowerInvariant()
            .Select(character => char.IsLetterOrDigit(character) ? character : '-')
            .ToArray();

        return string.Join('-', new string(chars).Split('-', StringSplitOptions.RemoveEmptyEntries));
    }
}
