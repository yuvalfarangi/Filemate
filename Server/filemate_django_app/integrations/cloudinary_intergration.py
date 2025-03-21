import cloudinary
import cloudinary.uploader
import requests
import os

# Cloudinary Config
CLOUDINARY_CLOUD_NAME = "dc8swnx9j"
CLOUDINARY_API_KEY = "755546754471913"
CLOUDINARY_API_SECRET = "BalPK3aBJzQbEKFpXQtfuoBiacE"
UPLOAD_PRESET = "ml_default" 

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)

def upload_file(file_path):
    try:
        response = cloudinary.uploader.upload(file_path, resource_type="raw", upload_preset=UPLOAD_PRESET)
        return {"id": response["public_id"], "url": response["secure_url"]}
    except Exception as e:
        print(f"Error uploading file to Cloudinary: {e}")
        raise e


def fetch_file(file_url, save_path="downloaded_file.jpg"):
    try:
        response = requests.get(file_url, stream=True)
        if response.status_code == 200:
            with open(save_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            return os.path.abspath(save_path)
        else:
            raise Exception(f"Failed to fetch file: {response.status_code}")
    except Exception as e:
        print(f"Error fetching file from Cloudinary: {e}")
        raise e
