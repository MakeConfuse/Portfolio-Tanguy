import os
from PIL import Image

media_dir = r"c:\Documents\Antigravity\Portfolio - Tanguy\Media"
supported_formats = ('.jpg', '.jpeg', '.png')

print(f"Scanning {media_dir}...")

for filename in os.listdir(media_dir):
    if filename.lower().endswith(supported_formats):
        filepath = os.path.join(media_dir, filename)
        filename_no_ext = os.path.splitext(filename)[0]
        output_path = os.path.join(media_dir, f"{filename_no_ext}.webp")
        
        try:
            with Image.open(filepath) as img:
                # Resize to max 1920px (1080p-ish high resolution)
                img.thumbnail((1920, 1920))
                
                img.save(output_path, "WEBP", quality=85)
                print(f"Converted & Resized: {filename} -> {os.path.basename(output_path)}")
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

print("Conversion complete.")
