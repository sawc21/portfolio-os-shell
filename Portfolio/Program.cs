namespace Portfolio;

using System.Text;
using Portfolio.Catalog;
using Portfolio.Content;
using Portfolio.Profile;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddRazorPages();
        builder.Services.AddSingleton<IMarkdownContentService, MarkdownContentService>();
        builder.Services.AddSingleton<IPortfolioProfileService, JsonPortfolioProfileService>();
        builder.Services.AddSingleton<IPortfolioCatalogService, JsonPortfolioCatalogService>();

        var app = builder.Build();

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseStatusCodePagesWithReExecute("/Error", "?statusCode={0}");
        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.MapStaticAssets();
        app.MapGet("/sitemap.xml", async (HttpContext context, IMarkdownContentService content) =>
        {
            var baseUri = GetBaseUri(context.Request);
            var paths = new List<string>
            {
                "/",
                "/projects",
                "/blog",
                "/resume",
                "/cv",
                "/contact"
            };

            paths.AddRange((await content.GetProjectsAsync()).Select(project => $"/projects/{project.Slug}"));
            paths.AddRange((await content.GetPostsAsync()).Select(post => $"/blog/{post.Slug}"));

            var xml = new StringBuilder();
            xml.AppendLine("""<?xml version="1.0" encoding="utf-8"?>""");
            xml.AppendLine("""<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">""");
            foreach (var path in paths.Distinct(StringComparer.OrdinalIgnoreCase))
            {
                xml.AppendLine("  <url>");
                xml.AppendLine($"    <loc>{System.Security.SecurityElement.Escape(new Uri(baseUri, path).ToString())}</loc>");
                xml.AppendLine("  </url>");
            }
            xml.AppendLine("</urlset>");

            return Results.Content(xml.ToString(), "application/xml", Encoding.UTF8);
        });

        app.MapGet("/feed.xml", async (HttpContext context, IMarkdownContentService content) =>
        {
            var baseUri = GetBaseUri(context.Request);
            var posts = await content.GetPostsAsync();
            var xml = new StringBuilder();
            xml.AppendLine("""<?xml version="1.0" encoding="utf-8"?>""");
            xml.AppendLine("""<rss version="2.0">""");
            xml.AppendLine("  <channel>");
            xml.AppendLine("    <title>Sawyer Cawthon Kernel Gallery</title>");
            xml.AppendLine("    <description>Thinking logs on product design, ASP.NET, C#, and self-hosting experiments.</description>");
            xml.AppendLine($"    <link>{EscapeXml(new Uri(baseUri, "/blog").ToString())}</link>");

            foreach (var post in posts)
            {
                var link = new Uri(baseUri, $"/blog/{post.Slug}").ToString();
                xml.AppendLine("    <item>");
                xml.AppendLine($"      <title>{EscapeXml(post.Title)}</title>");
                xml.AppendLine($"      <description>{EscapeXml(post.Summary)}</description>");
                xml.AppendLine($"      <link>{EscapeXml(link)}</link>");
                xml.AppendLine($"      <guid>{EscapeXml(link)}</guid>");
                xml.AppendLine($"      <pubDate>{post.Date.ToDateTime(TimeOnly.MinValue):R}</pubDate>");
                xml.AppendLine("    </item>");
            }

            xml.AppendLine("  </channel>");
            xml.AppendLine("</rss>");

            return Results.Content(xml.ToString(), "application/rss+xml", Encoding.UTF8);
        });

        app.MapRazorPages()
           .WithStaticAssets();

        app.Run();
    }

    private static Uri GetBaseUri(HttpRequest request)
    {
        return new Uri($"{request.Scheme}://{request.Host}");
    }

    private static string EscapeXml(string value)
    {
        return System.Security.SecurityElement.Escape(value) ?? string.Empty;
    }
}
