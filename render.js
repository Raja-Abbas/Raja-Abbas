const fs = require('fs');

function renderCustomMarkdown(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Process custom syntax FIRST (before standard markdown)

  // :::fullwidth table content :::
  content = content.replace(/:::fullwidth:::([\s\S]*?):::\/fullwidth:::/g, function(match, inner) {
    return '<table width="100%">' + inner + '</table>';
  });

  // :::center content :::
  content = content.replace(/:::center:::([\s\S]*?):::\/center:::/g, function(match, inner) {
    return '<div style="text-align:center;">' + inner + '</div>';
  });

  // :::avatar(url, size)
  content = content.replace(/:::avatar\(([^,]+),\s*([^)]+)\)/g,
    '<img src="$1" width="$2" height="$2" style="border-radius:50%; object-fit:cover;">');

  // :::badge(text, color)
  content = content.replace(/:::badge\(([^,]+),\s*([^)]+)\)/g,
    '<span style="display:inline-block;padding:4px 12px;border-radius:12px;background:$2;color:white;font-size:12px;font-weight:bold;">$1</span>');

  // ![circle](url) — circular image
  content = content.replace(/!\[circle\]\(([^)]+)\)/g,
    '<img src="$1" width="150" style="border-radius:50%; object-fit:cover;">');

  // ![rounded](url) — rounded image
  content = content.replace(/!\[rounded\]\(([^)]+)\)/g,
    '<img src="$1" width="150" style="border-radius:12px;">');

  // ![left](url) — left aligned image
  content = content.replace(/!\[left\]\(([^)]+)\)/g,
    '<div style="text-align:left;"><img src="$1" width="150" style="border-radius:50%; object-fit:cover;"></div>');

  // ![right](url) — right aligned image
  content = content.replace(/!\[right\]\(([^)]+)\)/g,
    '<div style="text-align:right;"><img src="$1" width="150" style="border-radius:50%; object-fit:cover;"></div>');

  // {red}text{/red} — colored text
  content = content.replace(/\{red\}([^}]+)\{\/red\}/g,
    '<span style="color:#e74c3c;">$1</span>');
  content = content.replace(/\{blue\}([^}]+)\{\/blue\}/g,
    '<span style="color:#58a6ff;">$1</span>');
  content = content.replace(/\{green\}([^}]+)\{\/green\}/g,
    '<span style="color:#3fb950;">$1</span>');
  content = content.replace(/\{purple\}([^}]+)\{\/purple\}/g,
    '<span style="color:#bc8cff;">$1</span>');
  content = content.replace(/\{gray\}([^}]+)\{\/gray\}/g,
    '<span style="color:#8b949e;">$1</span>');

  // Now standard markdown

  // Headers
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  content = content.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  content = content.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Links (not images)
  content = content.replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rules
  content = content.replace(/^---$/gm, '<hr>');

  // Line breaks
  content = content.replace(/\n/g, '<br>');

  return content;
}

const input = process.argv[2] || 'README.md';
const output = process.argv[3] || 'docs/index.html';

const readmeContent = renderCustomMarkdown(input);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raja Abbas Affandi - Full Stack Developer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #e6edf3;
      background: #0d1117;
      line-height: 1.6;
    }
    h1 { font-size: 2em; margin-bottom: 0.5em; color: #ffffff; }
    h2 { font-size: 1.5em; margin: 1.5em 0 0.5em; color: #ffffff; border-bottom: 1px solid #21262d; padding-bottom: 0.3em; }
    h3 { font-size: 1.2em; margin: 1em 0 0.3em; color: #ffffff; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    hr { border: none; border-top: 1px solid #30363d; margin: 1.5em 0; }
    strong { color: #ffffff; }
    table { border-collapse: collapse; width: 100%; }
    td { padding: 10px; vertical-align: middle; }
    img { max-width: 100%; }
    br { display: block; content: ''; margin-top: 0.5em; }
    @media (max-width: 600px) {
      h1 { font-size: 1.5em; }
      td { display: block; width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body>
${readmeContent}
</body>
</html>`;

fs.writeFileSync(output, html);
console.log('Generated: ' + output);
