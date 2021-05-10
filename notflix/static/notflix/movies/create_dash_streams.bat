rem first segment 
rem then create mpd 
rem do this for all mp4 files in current folder
FOR /f %%a IN ('dir /b /a-d *.mp4') DO (
rem    call "segment_input.bat" %%a
rem    call "generate_mpd.bat" %%a
    mkdir %%~na
    move %%a %%~na
    cd %%~na
rem segment the mp4
    ffmpeg -i %%a -s 640x360 -c:v libx264 -b:v 560k -r 24 -x264opts keyint=48:min-keyint=48:no-scenecut -profile:v main -preset fast -movflags +faststart -c:a aac -b:a 128k -ac 2 %%~na-low.mp4
    ffmpeg -i %%a -s 960x540 -c:v libx264 -b:v 1260k -r 24 -x264opts keyint=48:min-keyint=48:no-scenecut -profile:v main -preset fast -movflags +faststart -c:a aac -b:a 128k -ac 2 %%~na-med.mp4
    ffmpeg -i %%a -s 1280x720 -c:v libx264 -b:v 2240k -r 24 -x264opts keyint=48:min-keyint=48:no-scenecut -profile:v main -preset fast -movflags +faststart -c:a aac -b:a 128k -ac 2 %%~na-high.mp4
    ffmpeg -i %%a -s 1920x1080 -c:v libx264 -b:v 5050k -r 24 -x264opts keyint=48:min-keyint=48:no-scenecut -profile:v main -preset fast -movflags +faststart -c:a aac -b:a 128k -ac 2 %%~na-max.mp4
rem create the manifest
    MP4Box -dash 4000 -rap -bs-switching no -profile live -out manifest.mpd %%~na-low.mp4#audio %%~na-low.mp4#video %%~na-med.mp4#video %%~na-high.mp4#video
    cd ..
)


