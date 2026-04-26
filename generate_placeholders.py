
# Run this once to generate placeholder images (delete after adding real photos)
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('images', exist_ok=True)
colors_list = [
    ('#c0392b', '#e74c3c', 'falla1.jpg', 'Monument 1'),
    ('#e67e22', '#f39c12', 'falla2.jpg', 'La Cremà'),
    ('#8e44ad', '#9b59b6', 'falla3.jpg', 'Ofrenda'),
    ('#d35400', '#e67e22', 'falla4.jpg', 'Mascletà'),
    ('#922b21', '#c0392b', 'falla5.jpg', 'Ninots'),
]
for bg, fg, fname, label in colors_list:
    img = Image.new('RGB', (1920, 1080), bg)
    draw = ImageDraw.Draw(img)
    # gradient-ish overlay
    for y in range(1080):
        alpha = y / 1080
        r1,g1,b1 = int(bg[1:3],16), int(bg[3:5],16), int(bg[5:7],16)
        r2,g2,b2 = int(fg[1:3],16), int(fg[3:5],16), int(fg[5:7],16)
        r = int(r1 + (r2-r1)*alpha)
        g_c = int(g1 + (g2-g1)*alpha)
        b = int(b1 + (b2-b1)*alpha)
        draw.line([(0,y),(1920,y)], fill=(r,g_c,b))
    draw.ellipse([760, 340, 1160, 740], fill=fg, outline='white', width=6)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 80)
    except:
        font = ImageFont.load_default()
    draw.text((960, 540), label, fill='white', font=font, anchor='mm')
    img.save(f'images/{fname}', 'JPEG', quality=90)
    print(f'Created images/{fname}')
