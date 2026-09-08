import re, os, struct, subprocess

SITE="/Users/yeekit/Documents/工作空间/claude/answer-engine-optimization/site"
NEW="/tmp/dd/new"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=SITE+"/assets/diagrams"
os.makedirs(OUT, exist_ok=True)

JOBS={
 "llms-txt.html":["llms-txt.html","llms-txt"],
 "bei-ai-yin-yong-de-zhan.html":["bei-ai-yin-yong-de-zhan.html","bei-ai-yin-yong-5gongxing"],
 "geo-liu-wei-shen-ji.html":["geo-liu-wei-shen-ji.html","geo-liu-wei-liu-wei"],
 "geo-wu-huan-lian-lu.html":["geo-wu-huan-lian-lu.html","geo-wu-huan-lian-lu"],
 "nei-rong-xin-xian-du.html":["nei-rong-xin-xian-du.html","nei-rong-xin-xian-du"],
 "shi-ti-tu.html":["shi-ti-tu.html","shi-ti-tu"],
 "ai-pa-chong-guan-li.html":["ai-pa-chong-guan-li.html","ai-pa-chong-guan-li"],
 "wei-shen-me-ai-pian-ai-shi-shi.html":["wei-shen-me-ai-pian-ai-shi-shi-1.html","wei-shen-me-ai-1rag"],
 "wei-shen-me-ai-pian-ai-shi-shi.html":["wei-shen-me-ai-pian-ai-shi-shi-2.html","wei-shen-me-ai-2san-ceng"],
}
# article -> list of (new_svg_file, png_slug) in document order
BYART={}
for art,(nf,slug) in JOBS.items():
    BYART.setdefault(art,[]).append((nf,slug))

SVGRE=re.compile(r'<svg[^>]*class="entity-diagram".*?</svg>', re.S)
CSSRE=re.compile(r'<link[^>]*stylesheet[^>]*>')
VBRE=re.compile(r'<svg[^>]*?\bviewBox="([^"]+)"', re.S)
TPL=("<!DOCTYPE html><html><head><meta charset=\"UTF-8\">%s\n"
     "<style>html,body{margin:0;padding:0;background:#f5f5f7}"
     "svg.entity-diagram{display:block;margin:0 auto;width:%dw;height:%dhpx;max-width:none}"
     "</style></head><body>%s</body></html>")

rows=[]
for art,(pairs) in [(a,v) for a,v in BYART.items()]:
    path=SITE+"/articles/"+art
    t=open(path, encoding="utf-8").read()
    css=CSSRE.search(t).group(0)
    svgs=list(SVGRE.finditer(t))
    assert len(svgs)==len(pairs), (art, len(svgs), len(pairs))

    # 1) put the final /tmp/dd/new svg into the article (right-to-left)
    for m,(nf,_) in list(zip(svgs,pairs))[::-1]:
        svg=open(NEW+"/"+nf, encoding="utf-8").read().strip()
        t=t[:m.start()]+svg+"\n"+t[m.end():]
    open(path,"w",encoding="utf-8").write(t)

    # 2) export PNGs from the authoritative new/ svgs
    for m,(nf,slug) in zip(SVGRE.finditer(open(path,encoding="utf-8").read()), pairs):
        svg=m.group(0)
        w,h=(int(x) for x in VBRE.search(svg).group(1).split())
        tmp="/tmp/dd/final/%s.html"%slug
        os.makedirs("/tmp/dd/final", exist_ok=True)
        open(tmp,"w",encoding="utf-8").write(TPL%(css,w,h,svg))
        png=OUT+"/"+slug+".png"
        subprocess.run([CHROME,"--headless","--disable-gpu","--no-sandbox","--hide-scrollbars",
                        "--force-device-scale-factor=2","--default-background-color=00000000",
                        "--window-size=%d,%d"%(w,h),"--screenshot="+png,"file://"+tmp],
                       capture_output=True)
        d=open(png,'rb').read(33)
        pw,ph=struct.unpack('>II', d[16:24])
        rows.append((art,slug,w,h,pw,ph,os.path.getsize(png)))

    # 3) swap <svg> -> <img> (right-to-left)
    t=open(path,encoding="utf-8").read()
    for m,(nf,slug) in list(zip(SVGRE.finditer(t), pairs))[::-1]:
        svg=m.group(0)
        label=re.search(r'aria-label="([^"]*)"', svg).group(1)
        w,h=(int(x) for x in VBRE.search(svg).group(1).split())
        img=('<img src="../assets/diagrams/%s.png" alt="%s" width="%d" height="%d" '
             'loading="lazy" decoding="async">')%(slug,label,w,h)
        t=t[:m.start()]+img+"\n"+t[m.end():]
    open(path,"w",encoding="utf-8").write(t)

print("article".ljust(42),"png".ljust(30),"viewBox".ljust(14),"size".ljust(14),"bytes")
for art,slug,w,h,pw,ph,n in rows:
    print(slug.ljust(30), ("%dx%d"%(w,h)).ljust(14), ("%dx%d"%(pw,ph)).ljustify(14) if False else ("%dx%d"%(pw,ph)).ljust(14), n)
print("\ndone: %d diagrams exported + swapped into %d articles"%(len(rows), len(BYART)))
