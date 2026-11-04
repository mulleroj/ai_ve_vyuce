<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {{SEO_META}}
  <link rel="stylesheet" href="css/magazine-article.css?v=20261102-magazine-shared-v1" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=robot-20261103" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=robot-20261103" />
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=robot-20261103" />
  <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png?v=robot-20261103" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=robot-20261103" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png?v=robot-20261103" />
  <link rel="shortcut icon" href="/favicon.ico?v=robot-20261103" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=robot-20261103" />
</head>
<body class="magazine-article-page">
  <a class="skip-link" href="#main-content">Přeskočit na obsah</a>
  {{NAVIGATION}}
  {{HERO}}
  <main id="main-content" class="magazine-main">
    <div class="magazine-reading-grid{{GRID_CLASS}}">
      {{TOC}}
      <article class="workflow-article" id="{{ARTICLE_ID}}">
        {{INTRO}}
        {{ARTICLE_BODY}}
        {{BACK_TO_TOP}}
      </article>
    </div>
    {{RELATED}}
  </main>
  {{FOOTER}}
  <script src="js/main.js?v=20261102-magazine-shared-v1" defer></script>
  <script src="js/site-footer.js?v=20260927-human-loop" defer></script>
  {{ARTICLE_SCRIPTS}}
</body>
</html>
