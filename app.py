from flask import Flask, render_template, request, send_file
import yt_dlp

app = Flask(__name__)

def download_video(url):
    options = {'outtmpl': 'downloads/%(title)s.%(ext)s', 'format': 'best'}
    with yt_dlp.YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
    return filename

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form.get("url")
        if url:
            filename = download_video(url)
            return send_file(filename, as_attachment=True)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
