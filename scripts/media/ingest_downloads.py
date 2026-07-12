#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import mimetypes
import re
import shutil
from collections import Counter
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional

from PIL import Image, ImageOps

SOURCE_DIR = Path('/Users/gratia/Downloads')
PROJECT_ROOT = Path('/Users/gratia/Projects/ms-gratia-website')
ORIGINALS_DIR = PROJECT_ROOT / 'assets' / 'originals'
DERIVATIVES_DIR = PROJECT_ROOT / 'public' / 'media'
MANIFEST_PATH = PROJECT_ROOT / 'assets' / 'media-manifest.json'
CUTOFF = datetime.fromisoformat('2026-07-11T18:08:30').timestamp()
MAX_LONG_EDGE = 2500
TARGET_MAX_BYTES = 1_000_000
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', ''}
VIDEO_EXTENSIONS = {'.mp4', '.mov', '.m4v', '.webm'}
VALID_CATEGORIES = {
    'beauty',
    'creative',
    'special-effects',
    'resume',
    'branding',
    'about',
    'contact',
    'video',
    'unknown',
}

# Best-effort curated labels based on visual review of the current batch.
EXACT_OVERRIDES: dict[str, tuple[str, str]] = {
    '010138-old-age-sculpt-2432.jpg': ('old-age-sculpt-profile', 'special-effects'),
    '10313079_10203693339031588_3868991706747340021_n.jpg': ('burned-hand-prosthetic', 'special-effects'),
    '11393051_10155660129070416_6181085845584747339_n.jpg': ('shirtless-studio-portrait', 'beauty'),
    '12828363_1057292751001634_1614047194790742194_o-1.jpg': ('painted-body-profile', 'creative'),
    '16856698304_d400baaf0b_z (1).jpg': ('blue-hand-beauty-portrait', 'beauty'),
    '16856698304_d400baaf0b_z.jpg': ('blue-hand-beauty-portrait', 'beauty'),
    '16901771_1410993645607074_442085367_n.jpg': ('surya-creative-beauty', 'creative'),
    '2 (1).jpg': ('sugar-skull-portrait', 'special-effects'),
    '20160108_013423_edited.jpg': ('stitched-smile-closeup', 'special-effects'),
    '2018-01-22 Rooty Tilt Up 2_0425.jpg': ('rooty-sculpt-side-view', 'special-effects'),
    '2018-01-22 Rooty Tilt Up 2_0425_edited.jpg': ('rooty-sculpt-front-view', 'special-effects'),
    '214023-Old-Erik-3022_edit.jpg': ('old-man-red-scarf', 'special-effects'),
    '214023-Old-Erik-3022_edit_edited.jpg': ('old-man-closeup-portrait', 'special-effects'),
    '233627-alien-sculpt-2417 (1).jpg': ('alien-sculpt-front', 'special-effects'),
    '233627-alien-sculpt-2417.jpg': ('alien-sculpt-front', 'special-effects'),
    '3_Side.jpg': ('rooty-sculpt-side-angle', 'special-effects'),
    'Alien_Mask_Halloween-1746.jpg': ('blue-alien-mask-portrait', 'special-effects'),
    'Brow Mask.png': ('gray-brow-mask-portrait', 'special-effects'),
    'Brow Mask2.png': ('gray-brow-mask-portrait', 'special-effects'),
    'Brow Mask2_edited.jpg': ('gray-brow-mask-portrait-edit', 'special-effects'),
    'Brow Mask_edited (1).jpg': ('gray-brow-mask-closeup', 'special-effects'),
    'Brow Mask_edited.jpg': ('gray-brow-mask-portrait-edit', 'special-effects'),
    'Carol.jpg': ('plaid-fashion-portrait', 'beauty'),
    'Charlene.jpg': ('charlene-seated-portrait', 'beauty'),
    'Charlene2.jpg': ('charlene-lingerie-portrait', 'beauty'),
    'Charlene2_edited.jpg': ('charlene-lingerie-portrait-edit', 'beauty'),
    'Charlene2_edited.png': ('charlene-lingerie-crop', 'beauty'),
    'Charlene_edited.jpg': ('charlene-seated-portrait-edit', 'beauty'),
    'Coco (1).jpg': ('coco-headshot-portrait', 'beauty'),
    'Coco.jpg': ('coco-headshot-portrait', 'beauty'),
    'DSC07638 (1) (1).jpg': ('editorial-male-portrait', 'beauty'),
    'DSC07638 (1).jpg': ('editorial-male-portrait', 'beauty'),
    'DSC_1802-as-Smart-Object-1for-gratia_cropped.jpg': ('woods-fantasy-portrait', 'creative'),
    'Denim (1).PNG': ('denim-brand-layout', 'branding'),
    'Denim.PNG': ('denim-brand-layout', 'branding'),
    'Denim_edited.jpg': ('denim-brand-layout-edit', 'branding'),
    'Dogtooth.jpeg': ('dogtooth-poster-design', 'creative'),
    'EMAN.png': ('emancipation-poster-design', 'creative'),
    'EMAN_edited.jpg': ('emancipation-poster-design-edit', 'creative'),
    'GLUTym1.jpg': ('gold-body-beauty', 'creative'),
    'GLUTym1_edited.jpg': ('gold-body-beauty-edit', 'creative'),
    'Ganesha_8152 (1).jpg': ('ganesha-sculpt-closeup', 'creative'),
    'Ganesha_8152.jpg': ('ganesha-sculpt-closeup', 'creative'),
    'Ganesha_8158.jpg': ('ganesha-sculpt-portrait', 'creative'),
    "Gratia's Reel final.mp4": ('gratia-showreel-video', 'video'),
    'Gratia.jpg': ('gratia-side-profile', 'about'),
    'Gratia_edited.jpg': ('gratia-side-profile-edit', 'about'),
    'Halloween-2018-5 (1).jpg': ('anatomy-mask-front', 'special-effects'),
    'Halloween-2018-5.jpg': ('anatomy-mask-front', 'special-effects'),
    'IMG-20170320-WA0006.jpg2.jpg': ('ice-queen-bodypaint', 'creative'),
    'IMG_20161204_135636 (1).jpg': ('pink-eye-beauty', 'beauty'),
    'IMG_20161204_135636.jpg': ('pink-eye-beauty', 'beauty'),
    'IMG_9733.jpg': ('teal-mohawk-beauty', 'beauty'),
    'IMG_9737.JPG': ('alien-headpiece-portrait', 'special-effects'),
    'IMG_9739.jpg': ('blue-tree-bodypaint', 'creative'),
    'IMG_9741.jpg': ('punk-mohawk-portrait', 'beauty'),
    'IMG_9742.jpg': ('bald-cap-portrait', 'special-effects'),
    'Jasmin - fashion 2.jpg': ('jasmin-fashion-portrait', 'beauty'),
    'Jasmin2.jpg': ('jasmin-color-portrait', 'beauty'),
    'Jasmin2_edited.jpg': ('jasmin-color-portrait-edit', 'beauty'),
    'Jasmin3.jpg': ('jasmin-floral-portrait', 'beauty'),
    'Jerome.jpg': ('jerome-male-portrait', 'beauty'),
    'Jerome_edited (1).jpg': ('jerome-male-portrait-edit', 'beauty'),
    'Jerome_edited.jpg': ('jerome-male-portrait-edit', 'beauty'),
    'Joe.png': ('joe-story-screenshot', 'creative'),
    'Joe_edited (1).jpg': ('joe-story-screenshot-edit', 'creative'),
    'Joe_edited.jpg': ('joe-story-screenshot-edit', 'creative'),
    'Lil yatchy say something.jpeg': ('lil-yachty-poster', 'creative'),
    'MArjorie 2 (1).jpg': ('marjorie-headshot-portrait', 'beauty'),
    'MArjorie 2.jpg': ('marjorie-headshot-portrait', 'beauty'),
    'Magda.jpg': ('magda-fashion-portrait', 'beauty'),
    'Magda_edited.jpg': ('magda-fashion-portrait-edit', 'beauty'),
    'Maria Shoot.jpg': ('maria-editorial-portrait', 'beauty'),
    'Maria Shoot_edited.jpg': ('maria-editorial-portrait-edit', 'beauty'),
    'Miller Old Guy.jpg': ('older-man-portrait', 'beauty'),
    'Oksana.jpg': ('oksana-standing-portrait', 'beauty'),
    'Portrait 2.jpg': ('blue-hood-portrait', 'beauty'),
    'Portrait 2_edited.jpg': ('blue-hood-portrait-edit', 'beauty'),
    'Priscilia Wong.jpg': ('priscilia-beauty-headshot', 'beauty'),
    'Rhine-0365.jpg': ('turquoise-alien-portrait', 'special-effects'),
    'Rooty_Still_Vrt_002.jpg': ('rooty-sculpt-portrait', 'special-effects'),
    'Screen Shot 2023-04-05 at 4.54.45 AM.png': ('le-fleur-performance-still', 'creative'),
    'Screen Shot 2023-04-05 at 4.54_edited.jpg': ('le-fleur-performance-still-edit', 'creative'),
    'Screen Shot 2023-04-05 at 8.23.57 PM.png': ('luxury-cat-ad-still', 'creative'),
    'Screen Shot 2023-04-05 at 8.23_edited.jpg': ('luxury-cat-ad-still-edit', 'creative'),
    'Screen Shot 2023-04-09 at 9.02.56 PM.png': ('nfl-signage-still', 'creative'),
    'Screen Shot 2023-04-09 at 9.08.24 PM.png': ('retail-runway-still', 'creative'),
    'Screen Shot 2023-04-09 at 9.34.55 PM.png': ('sad-clown-closeup', 'creative'),
    'Screen Shot 2023-04-09 at 9.56.22 PM.png': ('converse-logo-still', 'branding'),
    'Screen Shot 2023-04-09 at 9.56_edited (1).jpg': ('converse-logo-still-edit', 'branding'),
    'Screen Shot 2023-04-09 at 9.56_edited (2).jpg': ('converse-logo-still-edit', 'branding'),
    'Screen Shot 2023-04-09 at 9.56_edited.jpg': ('converse-logo-still-edit', 'branding'),
    'Screen Shot 2023-04-09 at 9.58.45 PM.png': ('woman-testimonial-still', 'creative'),
    'Screen Shot 2023-04-09 at 9_edited.jpg': ('converse-logo-still-blur', 'branding'),
    'Screen Shot 2023-04-09 at 9_edited_edited.jpg': ('converse-logo-still-black', 'branding'),
    'Sheila-104_high_res.jpg': ('sheila-painted-portrait', 'creative'),
    'Sheila.jpg': ('sheila-painted-portrait-alt', 'creative'),
    'Sweatpants (1).PNG': ('sweatpants-video-still', 'creative'),
    'Sweatpants (2).PNG': ('sweatpants-title-card', 'creative'),
    'Sweatpants (3).PNG': ('sweatpants-title-card-wide', 'creative'),
    'Sweatpants (4).PNG': ('sweatpants-title-card-wide', 'creative'),
    'Sweatpants.PNG': ('sweatpants-video-closeup', 'creative'),
    'Sweatpants_edited (1).jpg': ('sweatpants-video-frame', 'creative'),
    'Sweatpants_edited.jpg': ('sweatpants-video-frame-alt', 'creative'),
    'Tonette Shoot (1).jpg': ('tonette-beauty-campaign', 'beauty'),
    'Tonette Shoot.jpg': ('tonette-beauty-campaign', 'beauty'),
    'Untitled Session00284.jpg': ('artist-applying-bald-cap', 'special-effects'),
    'Untitled Session00361.jpg': ('gray-hairline-closeup', 'special-effects'),
    'Untitled Session00369 (1).jpg': ('gray-temple-closeup', 'special-effects'),
    'Untitled Session00369.jpg': ('gray-temple-closeup', 'special-effects'),
    'Untitled Session00377.jpg': ('aged-skin-profile-closeup', 'special-effects'),
    'Untitled Session00378.jpg': ('aged-face-expression-closeup', 'special-effects'),
    'Untitled Session00382.jpg': ('aged-eye-closeup', 'special-effects'),
    'Untitled Session00392.jpg': ('blonde-bangs-closeup', 'special-effects'),
    'Van1.jpg': ('shirtless-studio-portrait-alt', 'beauty'),
    'WhatsApp Image 2023-04-04 at 8.32.17 AM.jpeg': ('desert-cowboy-portrait', 'creative'),
    'WhatsApp Image 2023-04-04 at 8.32_edited (1).jpg': ('desert-cowboy-portrait-edit', 'creative'),
    'WhatsApp Image 2023-04-04 at 8.32_edited (2).jpg': ('desert-cowboy-portrait-edit', 'creative'),
    'WhatsApp Image 2023-04-04 at 8.32_edited.jpg': ('desert-cowboy-portrait-edit', 'creative'),
    'WhatsApp Image 2023-04-05 at 4.29.25 AM.jpeg': ('editorial-male-portrait-alt', 'beauty'),
    'WhatsApp Image 2023-04-05 at 4.29_edited.jpg': ('editorial-male-portrait-alt-edit', 'beauty'),
    'WhatsApp Image 2023-04-05 at 6.30.24 AM copy.jpeg': ('gratia-signature-logo', 'branding'),
    'WhatsApp Image 2023-04-05 at 6.30_edited.jpg': ('gratia-wordmark-logo', 'branding'),
    '_148601.jpg': ('stitched-skin-prosthetic', 'special-effects'),
    '_330 (1).jpg': ('elderly-woman-bust', 'special-effects'),
    '_330.jpg': ('elderly-woman-bust', 'special-effects'),
    '_396 (1).jpg': ('white-haired-head-bust', 'special-effects'),
    '_396.jpg': ('white-haired-head-bust', 'special-effects'),
    '_396_edited (1).jpg': ('white-haired-head-portrait', 'special-effects'),
    '_396_edited.jpg': ('white-haired-head-portrait', 'special-effects'),
    '_IMG_9412.jpg': ('green-alien-beauty', 'special-effects'),
    '_Joker.jpg': ('joker-portrait', 'special-effects'),
    '_Joker_edited.jpg': ('joker-portrait-edit', 'special-effects'),
    '_MG_1514.jpg': ('purple-creature-portrait', 'special-effects'),
    '_MG_1714.jpg': ('battle-scar-portrait', 'special-effects'),
    '_MG_1836.jpg': ('pale-creature-portrait', 'special-effects'),
    '_MG_1935.jpg': ('screaming-undead-portrait', 'special-effects'),
    '_MG_2649.jpg': ('green-facepaint-portrait', 'special-effects'),
    '_NIK8653.jpg': ('torso-prosthetic-study', 'special-effects'),
    '_NIK8798 (1).jpg': ('closed-eyes-bearded-head', 'special-effects'),
    '_NIK8798-Edit.jpg': ('bearded-head-collage', 'special-effects'),
    '_NIK8798.jpg': ('closed-eyes-bearded-head', 'special-effects'),
    '_NIK8815.jpg': ('elderly-woman-bust-alt', 'special-effects'),
    '_NIK8821 (1).jpg': ('silver-beard-head-bust', 'special-effects'),
    '_NIK8821-Edit (1).jpg': ('silver-beard-head-collage', 'special-effects'),
    '_NIK8821-Edit.jpg': ('silver-beard-head-collage', 'special-effects'),
    '_NIK8821.jpg': ('silver-beard-head-bust', 'special-effects'),
    '_NIK8849-Edit.jpg': ('body-hair-prosthetic-collage', 'special-effects'),
    '_NIK8849.jpg': ('body-hair-prosthetic', 'special-effects'),
    '_Rhine-0514_5x.jpg': ('turquoise-alien-headshot', 'special-effects'),
    '_Warrior.jpg': ('green-warrior-portrait', 'special-effects'),
    '_edited (1).jpg': ('afro-backlit-portrait', 'beauty'),
    '_edited.jpg': ('afro-backlit-portrait', 'beauty'),
    '_final_IMG_9412-Edit_.jpg': ('green-alien-beauty-edit', 'special-effects'),
    '_marj_0455_high_res.jpg': ('marjorie-beauty-portrait', 'beauty'),
    '_marj_0455_high_res_edited.jpg': ('marjorie-beauty-portrait-edit', 'beauty'),
    'ab67616d0000b27304b17fe0ab5f0ccfecaef9f4.jpeg': ('stay-curious-cover', 'creative'),
    'brighter_zombie.jpg': ('bright-zombie-portrait', 'special-effects'),
    'clay-2443-3.jpg': ('clay-old-man-profile', 'special-effects'),
    'cover collage_NIK8821.jpg': ('prosthetic-heads-collage', 'special-effects'),
    'cowl-7237.jpg': ('ribbed-cowl-prosthetic', 'special-effects'),
    'dead-ringers-poster.jpg': ('dead-ringers-poster', 'creative'),
    'dead-ringers-poster_edited.jpg': ('dead-ringers-poster-edit', 'creative'),
    'earth.jpg': ('green-dancer-silhouette', 'creative'),
    'edith collage 330.jpg': ('elderly-woman-detail-collage', 'special-effects'),
    'facebook-meta-oculus-quest-2-super-bowl-ad-1.jpeg': ('meta-quest-two-still', 'creative'),
    'facebook-meta-oculus-quest-2-super-bowl-ad-1_edited (1).jpg': ('meta-quest-two-still-edit', 'creative'),
    'facebook-meta-oculus-quest-2-super-bowl-ad-1_edited.jpg': ('meta-quest-two-still-edit', 'creative'),
    'final-lion-1.jpg': ('demonic-lion-portrait', 'special-effects'),
    'g.png': ('gratia-monogram-logo', 'branding'),
    'gratia_contact.png': ('gratia-contact-card', 'contact'),
    'gratia_logo.png': ('gratia-script-logo', 'branding'),
    'guardians_3.jpeg': ('guardians-three-poster', 'creative'),
    'imats-beauty-9045.jpg': ('imats-neon-beauty', 'beauty'),
    'imats-beauty-9045_edited (1).jpg': ('imats-neon-beauty-edit', 'beauty'),
    'imats-beauty-9045_edited.jpg': ('imats-neon-beauty-edit', 'beauty'),
    'imats-beauty-9045_edited_edited.jpg': ('imats-neon-beauty-edit-alt', 'beauty'),
    'imats-beauty-9045_edited_edited_edited.jpg': ('imats-neon-beauty-closeup', 'beauty'),
    'jpeg': ('ombre-glamour-portrait', 'beauty'),
    'jpg': ('afro-backlit-portrait-full', 'beauty'),
    'lailani - yoga.jpg': ('lailani-yoga-bridge', 'beauty'),
    'mask-7196.jpg': ('creature-mask-profile', 'special-effects'),
    'mask-9889.jpg': ('creature-mask-front', 'special-effects'),
    'muse-compliance-music-video-feature.webp': ('muse-compliance-title-card', 'creative'),
    'muse-compliance-music-video-feature_edited.jpg': ('muse-compliance-title-card-edit', 'creative'),
    'muse-compliance-music-video-feature_edited_edited.jpg': ('muse-compliance-black-frame', 'creative'),
    'nymph01.jpg': ('nymph-bodypaint-portrait', 'creative'),
    'ombre.jpg': ('ombre-glamour-portrait', 'beauty'),
    'raymund14.jpg': ('go-slow-fashion-portrait', 'beauty'),
    'raymund4.jpg': ('raymund-seated-fashion', 'beauty'),
    'raymund5.jpg': ('raymund-reclining-fashion', 'beauty'),
    'sheila (1).jpg': ('sheila-flower-beauty', 'beauty'),
    'vincent 1 (1).jpg': ('vincent-studio-headshot', 'beauty'),
    'vincent 1.jpg': ('vincent-studio-headshot', 'beauty'),
    'vincent 3.jpg': ('vincent-cigarette-portrait', 'beauty'),
    'wide day-2.jpg': ('witch-creature-portrait', 'special-effects'),
    'woods.jpg': ('woods-fantasy-portrait-alt', 'creative'),
    'woods_edited.jpg': ('woods-fantasy-portrait-edit', 'creative'),
}

HAIR_PUNCH_MAP: dict[str, tuple[str, str]] = {
    '018': ('prosthetic-skin-seam', 'special-effects'),
    '022': ('older-man-head-bust', 'special-effects'),
    '030': ('older-man-head-portrait', 'special-effects'),
    '040': ('bearded-man-head-bust', 'special-effects'),
    '056': ('bearded-man-head-profile', 'special-effects'),
    '089': ('red-haired-head-bust', 'special-effects'),
    '158': ('red-haired-face-closeup', 'special-effects'),
    '160': ('closed-eye-face-closeup', 'special-effects'),
    '167': ('beard-neck-seam-closeup', 'special-effects'),
    '171': ('salt-pepper-beard-profile', 'special-effects'),
    '195': ('aged-eyelid-closeup', 'special-effects'),
    '200': ('aged-scalp-texture', 'special-effects'),
    '207': ('prosthetic-scalp-closeup', 'special-effects'),
    '218': ('hairline-texture-closeup', 'special-effects'),
    '238': ('burned-alien-head-bust', 'special-effects'),
    '254': ('burned-alien-head-portrait', 'special-effects'),
    '281': ('hair-punch-process-collage', 'special-effects'),
    '294': ('burned-alien-head-closeup', 'special-effects'),
    '295': ('arm-hair-strip', 'special-effects'),
    '296': ('skin-bump-closeup', 'special-effects'),
    '309': ('old-man-red-scarf-alt', 'special-effects'),
    '312': ('anatomy-mask-collage', 'special-effects'),
    '318': ('scar-prosthetic-strip', 'special-effects'),
    '322': ('skin-bump-closeup-alt', 'special-effects'),
}

NOISE_TOKENS = {
    'img', 'mg', 'nik', 'dsc', 'session', 'copy', 'high', 'res', 'for', 'gratia',
    'smart', 'object', 'wa0006', 'final', 'feature', 'cropped', 'portrait', 'shoot',
}
CATEGORY_KEYWORDS = {
    'video': ['reel', 'video', 'mp4'],
    'contact': ['contact'],
    'branding': ['logo', 'wordmark', 'monogram', 'signature', 'brand', 'denim', 'converse'],
    'resume': ['resume', 'cv'],
    'about': ['gratia-side', 'gratia-profile'],
    'special-effects': [
        'mask', 'prosthetic', 'alien', 'zombie', 'sculpt', 'joker', 'creature', 'old', 'aged',
        'halloween', 'anatomy', 'cowl', 'warrior', 'lion', 'brow', 'stitch', 'scar', 'skin', 'hair-punch',
    ],
    'beauty': [
        'beauty', 'portrait', 'headshot', 'fashion', 'glamour', 'editorial', 'seated', 'standing', 'yoga',
    ],
    'creative': [
        'poster', 'title-card', 'still', 'bodypaint', 'dancer', 'fantasy', 'cover', 'campaign', 'ad', 'screenshot',
    ],
}


@dataclass
class AssetRecord:
    sha256: str
    media_type: str
    category: str
    master_filename: str
    master_relpath: str
    master_bytes: int
    master_width: Optional[int]
    master_height: Optional[int]
    derivative_filename: str
    derivative_relpath: str
    derivative_bytes: int
    derivative_width: Optional[int]
    derivative_height: Optional[int]


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'&', ' and ', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-{2,}', '-', text).strip('-')
    return text or 'asset'


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def infer_extension(path: Path, detected_format: Optional[str]) -> str:
    ext = path.suffix.lower()
    if ext:
        return ext
    if detected_format:
        fmt = detected_format.lower()
        if fmt == 'jpeg':
            return '.jpg'
        return f'.{fmt}'
    return '.bin'


def guess_media_type(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in VIDEO_EXTENSIONS:
        return 'video'
    if ext in IMAGE_EXTENSIONS:
        try:
            with Image.open(path):
                return 'image'
        except Exception:
            pass
    mime, _ = mimetypes.guess_type(path.name)
    if mime and mime.startswith('video/'):
        return 'video'
    if mime and mime.startswith('image/'):
        return 'image'
    try:
        with Image.open(path):
            return 'image'
    except Exception:
        return 'unknown'


def extract_image_info(path: Path) -> tuple[int, int, str]:
    with Image.open(path) as image:
        fmt = image.format or 'unknown'
        oriented = ImageOps.exif_transpose(image)
        return oriented.width, oriented.height, fmt


def extract_video_info(path: Path) -> tuple[Optional[int], Optional[int], Optional[float]]:
    import subprocess

    width = height = None
    duration = None
    try:
        result = subprocess.run(
            [
                'mdls',
                '-raw',
                '-name', 'kMDItemPixelWidth',
                '-name', 'kMDItemPixelHeight',
                '-name', 'kMDItemDurationSeconds',
                str(path),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        raw_values = [value.strip() for value in result.stdout.replace('\x00', '\n').splitlines() if value.strip()]
        if len(raw_values) >= 3:
            duration = None if raw_values[0] == '(null)' else float(raw_values[0])
            height = None if raw_values[1] == '(null)' else int(float(raw_values[1]))
            width = None if raw_values[2] == '(null)' else int(float(raw_values[2]))
    except Exception:
        pass
    return width, height, duration


def unique_destination(directory: Path, base_slug: str, extension: str) -> Path:
    candidate = directory / f'{base_slug}{extension}'
    if not candidate.exists():
        return candidate
    index = 2
    while True:
        candidate = directory / f'{base_slug}-{index}{extension}'
        if not candidate.exists():
            return candidate
        index += 1


def classify_category(base_slug: str, media_type: str, suggested: Optional[str] = None) -> str:
    if suggested in VALID_CATEGORIES:
        return suggested
    if media_type == 'video':
        return 'video'
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in base_slug for keyword in keywords):
            return category
    return 'unknown'


def derive_name_and_category(path: Path, media_type: str) -> tuple[str, str]:
    original = path.name
    if original in EXACT_OVERRIDES:
        return EXACT_OVERRIDES[original]

    hair_match = re.search(r'Gratia Hair punch port-(\d+)', original, re.IGNORECASE)
    if hair_match:
        code = hair_match.group(1)
        if code in HAIR_PUNCH_MAP:
            return HAIR_PUNCH_MAP[code]
        return (f'hair-punch-study-{code}', 'special-effects')

    stem = path.stem if path.suffix else path.name
    stem = stem.replace("Gratia's", 'gratia')
    stem = re.sub(r'\((\d+)\)', '', stem)
    stem = re.sub(r'[_\s]+', '-', stem)
    stem = re.sub(r'-edited(?:-edited)*', '', stem, flags=re.IGNORECASE)
    stem = re.sub(r'\b\d{4}-\d{2}-\d{2}\b', '', stem)
    raw_tokens = [token for token in slugify(stem).split('-') if token]
    tokens: list[str] = []
    for token in raw_tokens:
        if token.isdigit() and len(token) > 3:
            continue
        if token in NOISE_TOKENS:
            continue
        tokens.append(token)

    if not tokens:
        tokens = ['media', 'asset']
    if len(tokens) == 1:
        if media_type == 'video':
            tokens.append('video')
        else:
            tokens.extend(['media', 'asset'])
    if len(tokens) == 2 and media_type == 'image':
        if 'logo' in tokens or 'contact' in tokens:
            tokens.append('graphic')
        elif any(token in {'mask', 'alien', 'zombie', 'prosthetic', 'sculpt'} for token in tokens):
            tokens.append('study')
        else:
            tokens.append('portrait')
    base_slug = '-'.join(tokens[:5])
    category = classify_category(base_slug, media_type)
    return base_slug, category


def save_image_derivative(source: Path, destination: Path) -> tuple[int, int, int]:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        has_alpha = 'A' in image.getbands()
        if has_alpha:
            working = image.convert('RGBA')
        else:
            working = image.convert('RGB')

        longest_edge = max(working.width, working.height)
        if longest_edge > MAX_LONG_EDGE:
            scale = MAX_LONG_EDGE / float(longest_edge)
            resized = (
                max(1, int(round(working.width * scale))),
                max(1, int(round(working.height * scale))),
            )
            working = working.resize(resized, Image.Resampling.LANCZOS)

        destination.parent.mkdir(parents=True, exist_ok=True)
        qualities = [84, 80, 76, 72, 68, 64, 60, 56, 52]
        chosen_bytes = None
        for quality in qualities:
            save_kwargs = {'format': 'WEBP', 'quality': quality, 'method': 6}
            if has_alpha:
                save_kwargs['lossless'] = False
            working.save(destination, **save_kwargs)
            size = destination.stat().st_size
            chosen_bytes = size
            if size <= TARGET_MAX_BYTES:
                break
        return working.width, working.height, int(chosen_bytes or destination.stat().st_size)


def relative_to_project(path: Path) -> str:
    return path.relative_to(PROJECT_ROOT).as_posix()


def main() -> int:
    ORIGINALS_DIR.mkdir(parents=True, exist_ok=True)
    DERIVATIVES_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

    source_files = sorted(
        p for p in SOURCE_DIR.rglob('*') if p.is_file() and p.stat().st_mtime > CUTOFF
    )

    manifest: dict[str, object] = {
        'generated_at': datetime.now().isoformat(timespec='seconds'),
        'source_directory': str(SOURCE_DIR),
        'cutoff_iso': '2026-07-11T18:08:30',
        'max_image_long_edge': MAX_LONG_EDGE,
        'target_image_bytes': TARGET_MAX_BYTES,
        'counts': {},
        'assets': [],
        'sources': [],
        'failures': [],
        'naming_caveats': [
            'Names and categories are best-effort and based on visual review plus filename heuristics.',
            'Byte-identical duplicates are deduplicated by SHA-256 and mapped to the same copied master/derivative.',
            'Video derivatives are preserved by copy because no local transcoder was required for this task.',
        ],
    }

    assets_by_hash: dict[str, AssetRecord] = {}
    failures: list[dict[str, str]] = []
    category_counter: Counter[str] = Counter()
    media_counter: Counter[str] = Counter()
    duplicate_sources = 0

    for source in source_files:
        source_name = source.name
        try:
            sha = sha256_file(source)
            media_type = guess_media_type(source)
            if media_type not in {'image', 'video'}:
                raise ValueError(f'Unsupported media type: {media_type}')

            if sha in assets_by_hash:
                asset = assets_by_hash[sha]
                duplicate_sources += 1
                manifest['sources'].append({
                    'original_download_name': source_name,
                    'original_download_path': str(source),
                    'sha256': sha,
                    'duplicate_of_master': asset.master_filename,
                    'master_filename': asset.master_filename,
                    'master_path': asset.master_relpath,
                    'derivative_filename': asset.derivative_filename,
                    'derivative_path': asset.derivative_relpath,
                    'media_type': asset.media_type,
                    'category': asset.category,
                    'master_width': asset.master_width,
                    'master_height': asset.master_height,
                    'master_bytes': asset.master_bytes,
                    'derivative_width': asset.derivative_width,
                    'derivative_height': asset.derivative_height,
                    'derivative_bytes': asset.derivative_bytes,
                })
                category_counter[asset.category] += 1
                media_counter[asset.media_type] += 1
                continue

            base_slug, category = derive_name_and_category(source, media_type)
            category = classify_category(base_slug, media_type, category)

            if media_type == 'image':
                master_width, master_height, detected_format = extract_image_info(source)
                master_extension = infer_extension(source, detected_format)
            else:
                master_width, master_height, duration = extract_video_info(source)
                detected_format = None
                master_extension = source.suffix.lower() or '.mp4'

            master_destination = unique_destination(ORIGINALS_DIR, base_slug, master_extension)
            shutil.copy2(source, master_destination)
            master_bytes = master_destination.stat().st_size

            if media_type == 'image':
                derivative_destination = unique_destination(DERIVATIVES_DIR, master_destination.stem, '.webp')
                derivative_width, derivative_height, derivative_bytes = save_image_derivative(master_destination, derivative_destination)
                derivative_duration = None
            else:
                derivative_destination = unique_destination(DERIVATIVES_DIR, master_destination.stem, master_extension)
                shutil.copy2(master_destination, derivative_destination)
                derivative_bytes = derivative_destination.stat().st_size
                derivative_width, derivative_height = master_width, master_height
                derivative_duration = duration

            asset = AssetRecord(
                sha256=sha,
                media_type=media_type,
                category=category,
                master_filename=master_destination.name,
                master_relpath=relative_to_project(master_destination),
                master_bytes=master_bytes,
                master_width=master_width,
                master_height=master_height,
                derivative_filename=derivative_destination.name,
                derivative_relpath=relative_to_project(derivative_destination),
                derivative_bytes=derivative_bytes,
                derivative_width=derivative_width,
                derivative_height=derivative_height,
            )
            assets_by_hash[sha] = asset

            asset_entry = {
                'sha256': sha,
                'master_filename': asset.master_filename,
                'master_path': asset.master_relpath,
                'derivative_filename': asset.derivative_filename,
                'derivative_path': asset.derivative_relpath,
                'media_type': media_type,
                'category': category,
                'master_width': master_width,
                'master_height': master_height,
                'master_bytes': master_bytes,
                'derivative_width': derivative_width,
                'derivative_height': derivative_height,
                'derivative_bytes': derivative_bytes,
            }
            if media_type == 'video':
                asset_entry['duration_seconds'] = derivative_duration
            manifest['assets'].append(asset_entry)

            source_entry = {
                'original_download_name': source_name,
                'original_download_path': str(source),
                'sha256': sha,
                'master_filename': asset.master_filename,
                'master_path': asset.master_relpath,
                'derivative_filename': asset.derivative_filename,
                'derivative_path': asset.derivative_relpath,
                'media_type': media_type,
                'category': category,
                'master_width': master_width,
                'master_height': master_height,
                'master_bytes': master_bytes,
                'derivative_width': derivative_width,
                'derivative_height': derivative_height,
                'derivative_bytes': derivative_bytes,
            }
            if media_type == 'video':
                source_entry['duration_seconds'] = derivative_duration
            manifest['sources'].append(source_entry)

            category_counter[category] += 1
            media_counter[media_type] += 1
        except Exception as exc:
            failures.append({'source': str(source), 'error': str(exc)})

    manifest['failures'] = failures
    manifest['counts'] = {
        'source_files': len(source_files),
        'unique_assets': len(assets_by_hash),
        'duplicate_sources': duplicate_sources,
        'failures': len(failures),
        'by_media_type': dict(media_counter),
        'by_category': dict(category_counter),
    }

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, sort_keys=False) + '\n', encoding='utf-8')

    print(json.dumps(manifest['counts'], indent=2))
    if failures:
        print('Failures:')
        for failure in failures:
            print(f"- {failure['source']}: {failure['error']}")
    return 0 if not failures else 1


if __name__ == '__main__':
    raise SystemExit(main())
