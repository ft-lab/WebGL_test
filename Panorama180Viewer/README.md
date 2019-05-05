## Panorama180Viewer

パノラマ180-3Dの静止画または動画をWebVRで見る。    
fish Eye動画のShaderを使ったリアルタイム反映など。   

## コードの内容

three.jsのShaderを使用して、    
静止画または動画がEquirectangular180またはFish Eye180のどちらでもVRで見ることができるようにしています。

## 動画のwebm変換について

動画ファイルは、オリジナルのMirage Cameraで撮影した3840 x 2160ピクセルのmp4(H.264)です。    
これを、ffmpeg ( https://ffmpeg.org/ ) でwebm(VP9)に変換しました。    

変換は以下のようにコマンドラインで行いました。    

    ffmpeg -i 20190224-151603623.vr.mp4 -threads 4 -b:v 0 -crf 40 -vcodec vp9  ueno_park_20190224.webm

「20190224-151603623.vr.mp4」がオリジナルの動画ファイル。    
「-threads 4」で変換で使用するスレッド数を指定。    
「-b:v 0 -crf 40」で品質指定。    
「-b:v 0」の指定は必須。    
「-crf」は0-63で0に近づくほど品質が上がる。   
ただし、品質を上げると計算時間がかかり、ファイルサイズは大きくなる。    
「-vcodec vp9」でVP9のコーデック指定。    

上記変換で「20190224-151603623.vr.mp4」が37.9MBだったのが、「ueno_park_20190224.webm」で2.99MBになった。    

## [show_webvr180_sbs.html](./show_webvr180_sbs.html)

パノラマ180-3D(Side By Side)の静止画をWebVRでプレビューします。    

![show_webvr180_sbs](../images/Panorama180Viewer_img_00.jpg)    

以下は、実行デモです。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs.html

URLの引数として、以下のように指定できます。    

    image=xxx.jpg&intensity=1.2&projectionmode=1

imageで参照する画像ファイル、intensityで明るさ、    
projectionmode＝１でEquirectangularのSide By Side、projectionmode＝2でFish EyeのSide By Sideです。    


## [show_webvr180_sbs_video.html](./show_webvr180_sbs_video.html)

パノラマ180-3D(Side By Side)の動画をWebVRでプレビューします。    
このパノラマ動画は、Mirage Cameraで撮影したFish Eyeをwemb(VP9)に変換したものになります。    

![show_webvr180_sbs_video](../images/Panorama180Viewer_img_01.jpg)    

~~WebVR前の画面にて、左上に動画のサムネイルを表示してます。~~     
サムネイルを表示すると、Oculus Goで速度低下したので外しました。    

Oculus GoのOculus Browser(標準ブラウザ)、Firefox Realityでの調査は後述。    

以下は、実行デモです。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html

URLの引数として、以下のように指定できます。    

    image=xxx.mp4&intensity=1.2&projectionmode=1

imageで参照する動画ファイル、intensityで明るさ、    
projectionmode＝１でequirectangularのSide By Side、projectionmode＝2でFish EyeのSide By Sideです。    

## Oculus Goでの検証用

いくつかチェック用。    

### [-crf 40]

ffmpegで変換する際に「-crf 40」を指定したもの。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html


Oculus Browserでは安定動作。    
Firefox Realityでは2ループ目あたりで途中で止まったりする。    

### [ 投影変換のShaderをEquirectangular180にする ]

動画自身はFish Eyeであるが、これを計算負荷のほとんどないEquirectangular180にする。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html?projectionmode=1

Oculus Browserでは安定動作。    
Firefox Realityでもスムーズに安定した。    

### [ Equirectangular180 + 品質下げる（-crf 50） ]

ffmpegで変換する際に「-crf 50」を指定し品質を下げたwebmを用意。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html?projectionmode=1&image=videos/ueno_park_crf50.webm

### [ Equirectangular180 + 品質下げる（-crf 60） ]

ffmpegで変換する際に「-crf 60」を指定し品質を下げたwebmを用意。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html?projectionmode=1&image=videos/ueno_park_crf60.webm

### [ 解像度を下げる ]

1920 x 1080 ピクセルの解像度にした。    

以下、「-crf 40」の指定。    
「-vf "scale=1920:1080"」を指定して、解像度を半分にした。    

https://ft-lab.jp/WebGL/WebGLTest/Panorama180Viewer/show_webvr180_sbs_video.html?image=videos/ueno_park_crf40_half.webm

Oculus Browserでは安定動作。    
Firefox Realityでもスムーズに安定した。    

   

----
