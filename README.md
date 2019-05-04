## WebGL Test

WebGLの覚書用です。    
three.jsを使用しています。

## 開発環境

three.js r104    

## ソース説明

three.jsのJavaScriptの指定は、「../threejs」内に配置しています。    
three.jsのファイルは、このGitHubのリポジトリには内包していません。    
環境に合わせて書き換えるようにしてくださいませ。    

    <script src="../threejs/build/three.min.js"></script>
    <script src="../threejs/vr/WebVR.js"></script>
    <script src="../threejs/loaders/GLTFLoader.js"></script>		


## 内容

|項目名|内容|
|---|---|
|[Panorama180Viewer](./Panorama180Viewer)|パノラマ180-3Dの静止画または動画をWebVRで見る。fish Eye動画のShaderを使ったリアルタイム反映など|

