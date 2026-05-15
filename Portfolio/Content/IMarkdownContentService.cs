namespace Portfolio.Content;

public interface IMarkdownContentService
{
    Task<IReadOnlyList<ContentItem>> GetPostsAsync();

    Task<ContentItem?> GetPostBySlugAsync(string slug);

    Task<IReadOnlyList<ContentItem>> GetProjectsAsync();

    Task<ContentItem?> GetProjectBySlugAsync(string slug);

    Task<ContentItem?> GetResumeAsync();
}

