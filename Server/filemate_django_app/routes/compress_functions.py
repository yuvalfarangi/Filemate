import os
import zipfile
from filemate_django_app.integrations.cloudinary_intergration import upload_file, fetch_file
from PIL import Image
import mimetypes
import subprocess



def get_file_type(file_path):
    # Get the file extension
    _, ext = os.path.splitext(file_path)
    
    # Remove the leading dot (e.g., .png → png)
    ext = ext.lower().lstrip('.')
    
    # If the extension is missing, try mimetypes
    if not ext:
        mime_type, _ = mimetypes.guess_type(file_path)
        return mime_type.split('/')[-1] if mime_type else "unknown"
    
    return ext


def zip_compress(original_file):

        try:
            # Define the output ZIP file name
            output_zip = original_file + ".zip"

            # Compress the file with zipfile
            with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(original_file, arcname=os.path.basename(original_file))  

            # Upload the compressed file to Cloudinary
            if not output_zip:
                return 

            res = upload_file(output_zip)
            return res

        except Exception as e:
            print(e)
            return


def image_compress(original_file, quality=60):
    try:
        img = Image.open(original_file)
        
        # Create a new filename for the compressed file
        compressed_file = f"compressed_{os.path.basename(original_file)}"
        
        # Save the compressed image
        img.save(compressed_file, quality=quality, optimize=True)

        # Upload the compressed file
        res = upload_file(compressed_file)
        if not res:
            return

        return res

    except Exception as e:    
        print(f"Error during image compression: {e}")
        return


def video_compress(original_file):

    try:
        compressed_file = f"compressed_{os.path.basename(original_file)}"
        command = f'ffmpeg -i "{original_file}" -c:v libx265 -crf 28 -preset slow -c:a aac "{compressed_file}"'
        subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if not os.path.exists(compressed_file):
            return

        # Upload the compressed file
        res = upload_file(compressed_file)
        if not res:
            return

        return res

    except Exception as e:    
        print(f"Error during image compression: {e}")
        return