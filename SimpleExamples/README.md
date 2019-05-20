## SimpleExamples

WebGL/WebVRの簡単なサンプルです。    

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
----
### [show_panorama360.html](./show_panorama360.html)    

パノラマ360-3Dの静止画をWebVRで見る。    
![show_panorama360](../images/simpleExamples_show_panorama360.jpg)     
パノラマ画像は、Unity上のOctaneでレンダリング。    

以下は、実行デモです。    
[https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_panorama360.html](https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_panorama360.html)    

----

### [show_gltf.html](./show_gltf.html)    

これは、WebGLのサンプルになります(WebVRではありません)。    

glTFの読み込み。    
exrファイルをEquirectangularで読み込んで、CubeMapに変換してEnvMapとして割り当て。    
背景のjpegファイルをEquirectangularで読み込んで、背景球に割り当て。    
地面に影のみを落とす。    
THREE.OrbitControlsを使用してのマウスドラッグでのカメラ操作（視点固定、回転のみ）。    
ログの表示。    
テクスチャや形状の読み込みは、非同期で行っています。     
![show_gltf](../images/simpleExamples_show_gltf.jpg)     
パノラマ画像は、Unity上のOctaneでレンダリング。    

以下は、実行デモです。    
[https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_gltf.html](https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_gltf.html)    

----

### [show_gltf_vr.html](./show_gltf_vr.html)    

上記の「show_gltf.html」をWebVR対応にしたものです。    

glTFの読み込み。    
exrファイルをEquirectangularで読み込んで、CubeMapに変換してEnvMapとして割り当て。    
背景のjpegファイルをEquirectangularで読み込んで、背景球に割り当て。    
地面に影のみを落とす。    
THREE.OrbitControlsを使用してのマウスドラッグでのカメラ操作（視点固定、回転のみ）。    
ログの表示。    
テクスチャや形状の読み込みは、非同期で行っています。     
VR実行時にカメラを固定(3DoF)。    
![show_gltf_vr](../images/simpleExamples_show_gltf_vr.jpg)     
パノラマ画像は、Unity上のOctaneでレンダリング。    

以下は、実行デモです。    
[https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_gltf_vr.html](https://ft-lab.jp/WebGL/WebGLTest/SimpleExamples/show_gltf_vr.html)    
