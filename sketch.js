let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function gotFaces(results) {
  faces = results;
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  // 隱藏原始的 HTML 影片元件，只顯示在畫布上
  capture.hide();

  // 初始化 FaceMesh (採用 ml5 v1 推薦格式以消除警告)
  faceMesh = ml5.faceMesh(options, () => {
    faceMesh.detectStart(capture, gotFaces);
  });
}

function draw() {
  background('#e7c6ff');

  let vW = windowWidth * 0.5;
  let vH = windowHeight * 0.5;
  let x = (windowWidth - vW) / 2;
  let y = (windowHeight - vH) / 2;

  // 檢查攝影機是否正常運作
  if (capture.width === 0) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("正在啟動攝影機，若長時間未顯示請檢查權限設定...", windowWidth / 2, windowHeight / 2);
    return;
  }

  push();
  // 將座標點移動到影像區域的右上角，準備進行左右翻轉
  translate(x + vW, y);
  scale(-1, 1);
  // 繪製影像
  image(capture, 0, 0, vW, vH);

  // 若偵測到臉部，則繪製指定編號的連線
  if (faces.length > 0 && capture.width > 0) {
    let face = faces[0];
    // 定義兩組要連線的點位編號
    let paths = [
      [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
      [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184],
      // 左眼外圈 (包含 247)
      [247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 226, 130, 247],
      // 左眼內圈 (包含 246)
      [246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33, 246]
    ];
    
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(7);   // 粗細為 7
    noFill();

    let sX = vW / capture.width;
    let sY = vH / capture.height;

    // 遍歷所有路徑進行繪製
    for (let points of paths) {
      for (let i = 0; i < points.length - 1; i++) {
        let p1 = face.keypoints[points[i]];
        let p2 = face.keypoints[points[i + 1]];
        line(p1.x * sX, p1.y * sY, p2.x * sX, p2.y * sY);
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
