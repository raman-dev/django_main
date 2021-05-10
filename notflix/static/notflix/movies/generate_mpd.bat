if exist %~n1\ (
    goto create_mpd
) else (
    mkdir %~n1
)
:create_mpd
cd %~n1
MP4Box -dash 4000 -rap -bs-switching no -profile live -out manifest.mpd %~n1-low.mp4#audio %~n1-low.mp4#video %~n1-med.mp4#video %~n1-high.mp4#video
cd ..