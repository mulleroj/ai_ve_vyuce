# Staging package audit workflow

This isolated audit PR builds a deterministic static archive only from source commit 69221d32aad4258c365eb41d14dc52aa2b303a8e. It uses the standard pull_request trigger and grants contents: read. It has no deploy step, Netlify credential, or production secret.

The workflow checks out the audit PR separately from the publication source. It checks out the pinned source with Git LFS enabled and verifies the exact commit and clean tree before packaging.

The packager derives public page roots from sitemap.xml (103 HTML URLs), follows local HTML, CSS, JavaScript, and runtime references, and includes the complete contents of referenced runtime asset directories to account for dynamically selected files. It preserves the available Netlify redirect/header configuration, robots.txt, and sitemap.xml. It excludes Git metadata, GitHub workflow files, tests, fixtures, audit documentation, and development dependencies.

The ZIP and per-file SHA-256 manifest are verified against a fresh extraction. HTTP checks and all six existing Browser QA suites run against that extracted archive over loopback HTTP. The artifact is retained for 30 days.

No Netlify project is created and nothing is deployed.
