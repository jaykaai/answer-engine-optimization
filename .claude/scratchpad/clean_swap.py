import re, os, struct, subprocess

SITE = "/Users/yeekit/Documents/工作空间/claude/answer-engine-optimization/site"
NEW = "/tmp/dd/new"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = SITE + "/assets/diagrams"
TMP = "/tmp/dd/final"
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)

# article -> [(svg_source_in_new, png_slug)] in document order
JOBS = {
 "llms-txt.html": [("llms-txt.html", "llms-txt")],
 "bei-ai-yin-yong-de-zhan.html": [("bei-ai-yin-yong-de-zhan.html", "bei-ai-yin-yong-5gongxing")],
 "geo-liu-wei-shen-ji.html": [("geo-liu-wei-shen-ji.html", "geo-liu-wei-liu-wei")],
 "geo-wu-huan-lian-lu.html": [("geo-wu-huan-lian-lu.html", "geo-wu-huan-lian-lu")],
 "nei-rong-xin-xian-du.html": [("nei-rong-xin-xian-du.html", "nei-rong-xin-xian-du")],
 "shi-ti-tu.html": [("shi-ti-tu.html", "shi-ti-tu")],
 "ai-pa-chong-guan-li.html": [("ai-pa-chong-guan-li.html", "ai-pa-chong-guan-li")],
 "wei-shen-me-ai-pian-ai-shi-shi.html": [
    ("wei-shen-me-ai-pian-ai-shi-shi-1.html", "wei-shen-me-ai-1rag"),
    ("wei-shen-me-ai-pian-ai-shi-shi-2.html", "wei-shen-me-ai-2san-ceng")],
}
SVG_RE = re.compile(r'<svg[^>]*class="entity-diagram".*?</svg>', re.S)
CSS_RE = re.compile(r'<link[^>]*stylesheet[^>]*>')
VB_RE  = re.compile(r'<svg[^>]*?\bviewBox="([^"]+)"', re.S)
TPL = ("<!DOCTYPE html><html><head><meta charset=\"UTF-8\">%s\n"
       "<style>html,body{margin:0;padding:0;background:#f5f5f7}"
       "svg.entity-diagram{display:block;margin:0 auto;width:%dw;height:%dhpx;max-width:none}"
       "</style></head><body>%s</body></html>")

results = []
for art, pairs in JOBS.items():
    path = SITE + "/articles/" + art
    t = open(path, encoding="utf-8").read()
    css = CSS_RE.search(t).group(0)
    svgs = list(SVG_RE.finditer(t))
    assert len(svgs) == len(pairs), (art, len(svgs), len(pairs))

    # Step 1: inject final SVGs from /tmp/dd/new, right-to-left
    for i in range(len(svgs)-1, -1, -1):
        nf = pairs[i][0]
        m = svgs[i]
        svg = open(NEW + "/" + nf, encoding="utf-8").read().strip()
        t = t[:m.start()] + svg + "\n" + t[m.end():]
    open(path, "w", encoding="utf-8").write(t)

    # Step 2: export PNGs from the authoritative /tmp/dd/new SVGs
    for nf, slug in pairs:
        svg = open(NEW + "/" + nf, encoding="utf-8").read().strip()
        vb = VB_RE.search(svg).group(1).split()
        w, h = int(vb[2]), int(vb[3])
        tmp = TMP + "/" + slug + ".html"
        open(tmp, "w", encoding="utf-8").write(TPL % (css, w, h, svg))
        png = OUT + "/" + slug + ".png"
        subprocess.run([CHROME, "--headless", "--disable-gpu", "--no-sandbox",
                        "--hide-scrollbars", "--force-device-scale-factor=2",
                        "--default-background-color=00000000",
                        "--window-size=%d,%d" % (w, h), "--screenshot=" + png,
                        "file://" + tmp], capture_output=True)
        d = open(png, "rb").read(33)
        pw, ph = struct.unpack(">II", d[16:24])
        results.append((slug, w, h, pw, ph, os.path.getsize(png)))

    # Step 3: swap <svg> -> <img>, right-to-left
    t = open(path, encoding="utf-8").read()
    svgs2 = list(SVG_RE.finditer(t))
    for i in range(len(svgs2)-1, -1, -1):
        m = svgs2[i]
        slug = pairs[i][1]
        svg = m.group(0)
        label = re.search(r'aria-label="([^"]*)"', svg).group(1)
        vb = VB_RE.search(svg).group(1).split()
        w, h = int(vb[2]), int(vb[3])
        img = ('<img src="../assets/diagrams/%s.png" alt="%s" width="%d" height="%d" '
               'loading="lazy" decoding="async">') % (slug, label, w, h)
        t = t[:m.start()] + img + "\n" + t[m.end():]
    open(path, "w", encoding="utf-8").write(t)

print("png".ljust(34), "vb".ljust(14), "px".ljust(14), "bytes")
for slug, w, h, pw, ph, n in results:
    print(slug.ljust(34), ("%dx%d"%(w,h)).ljust(14), ("%dx%d"%(pw,ph)).ljust(14), n)
print("\nexported %d pngs across %d articles" % (len(results), len(JOBS)))
