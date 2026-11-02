# AceAction-5M

**A Hierarchically Annotated 3D Gameplay Dataset for Game Agents**

[Project website](https://zhangdaxia22.github.io/AceAction-5M/)

Ruoxuan Zhang<sup>1,3*</sup>, Kailing Li<sup>2,3*</sup>, Zheyuan Zhou<sup>3</sup>, Boyang Chu<sup>3</sup>, Yingshan Lei<sup>3</sup>, Hongxia Xie<sup>1</sup>, Liang Du<sup>3</sup>, Zixun Sun<sup>3</sup>

<sup>1</sup> Jilin University · <sup>2</sup> East China Normal University · <sup>3</sup> Tencent

<sup>*</sup> Equal contribution. Contact: [Rosanzhang@tencent.com](mailto:Rosanzhang@tencent.com)

This repository hosts the academic project website for AceAction-5M, with a rotating gallery of 29 gameplay images.

## Local preview

No build step or external dependencies are required. Run the following in the repository directory, then open <http://localhost:8000>:

```sh
python3 -m http.server 8000
```

## GitHub Pages

The website is served from the root of the `main` branch. The `.nojekyll` file preserves the static assets without Jekyll processing.

## Website files

- `index.html`: project information, authors, and page sections.
- `style.css`, `hero-mascot.css`, `viewer.css`: responsive page and example viewer styles.
- `app.js`, `viewer.js`: gallery, filters, and trajectory viewer.
- `data.js`, `example_sources.json`: selected examples and their source metadata.
- `assets/`: mascot and gameplay images.
