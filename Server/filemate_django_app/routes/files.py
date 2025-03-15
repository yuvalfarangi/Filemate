from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from filemate_django_app.integrations.cloudinary_intergration import upload_file, fetch_file
from .compress_functions import zip_compress, image_compress, video_compress, get_file_type
from filemate_django_app.models import FileCompression, User, FileDownload
import yt_dlp
from rest_framework.permissions import IsAuthenticated


class FilesHistoryView(APIView):

    permission_classes = [IsAuthenticated]

    # GET /api/file/history/
    def get(self, request):

        print(request.headers.get('Authorization'))
        user_id = request.query_params.get("user_id") 

        if not user_id:
            return Response({"message": "User ID is required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)

        # Fetch File Compression History
        compression_history = FileCompression.objects.filter(user=user).values(
            "original_file", "compressed_file", "compression_type", "status", "size", "created_at"
        )

        # Fetch File Download History
        download_history = FileDownload.objects.filter(user=user).values(
            "url", "file_path", "status", "size", "created_at"
        )

        print(list(compression_history), list(download_history))

        return Response({
            "message": "File history retrieved successfully!",
            "compression_history": list(compression_history),
            "download_history": list(download_history)
        }, status=200)




class FilesCompressionView(APIView):

    # POST /api/file/compress/
    def post(self, request):

        required_fields = ["user_id", "fileUrl"]

        # Validate required fields
        for field in required_fields:
            if not request.data.get(field):
                return Response({"message": f"{field} is required"}, status=400)

         # Exporting required fields
        user = User.objects.get(id=request.data.get("user_id"))
        if not user:
            return Response({"message": "User fetching failed."}, status=500)

        original_file = fetch_file(request.data.get("fileUrl"))
        if not original_file:
            return Response({"message": "File fetching failed."}, status=500)

        file_type = get_file_type(original_file)
        match file_type:
            
            case 'png' | 'jpg':
                # IMAGE COMPRESSING
                res = image_compress(original_file)
                if not res:
                    return Response({"message": "File compression failed."}, status=500)

            case 'mp4' | 'mov':
                #VIDEO COMPRESSING
                res = video_compress(original_file) 
                if not res:
                    return Response({"message": "File compression failed."}, status=500)

            case _:
                # ZIP COMPRESSING
                res = zip_compress(original_file)
                if not res:
                    return Response({"message": "File compression failed."}, status=500)

        # Save to Database
        print(FileCompression.objects.create(
            user = user,
            original_file = original_file,
            compressed_file = res["url"],
            compression_type = file_type,
            status ="completed",
            size=0
        ))

        # Return final response
        return Response({"message": "File compressed successfully!", "res": res}, status=200)



    

class FilesDownloadView(APIView):

    # GET /api/file/download/
    def post(self, request):

        required_fields = ["user_id", "url"]

        # Validate required fields
        for field in required_fields:
            if not request.data.get(field):
                return Response({"message": f"{field} is required"}, status=400)

         # Exporting required fields
        user = User.objects.get(id=request.data.get("user_id"))
        if not user:
            return Response({"message": "User fetching failed."}, status=500)

        url = request.data.get("url")
        

        try:
            # yt-dlp options
            ydl_opts = {
                'format': 'best',  # Download best available quality
                'outtmpl': '%(title)s.%(ext)s',  # Save file with video title
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(url, download=True)
                video_filename = ydl.prepare_filename(info_dict)  # Get downloaded filename

            # Upload to Cloudinary
            res = upload_file(video_filename)

            # Check if upload was successful
            if not res or "url" not in res:
                return Response({"message": "File upload failed."}, status=500)

             # Save to Database
            print(FileDownload.objects.create(
                user = user,
                url = url,
                file_path = res["url"],
                status = "Completed",
                size = 0
            ))


            return Response({
                "message": "File downloaded successfully!",
                "video_url": res["url"]
            }, status=200)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"message": "File download failed.", "error": str(e)}, status=500)