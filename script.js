const video = document.getElementById("video");


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//mouth,eyes,nose etc are detected by this...
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //recognize our face about where it is ...
  faceapi.nets.faceExpressionNet.loadFromUri('/models')//detect our face expression happy,sad and smiling etc...
]
).then(startVideo)

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    console.log(detections)

  }, 100)
})


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => {
      video.srcObject = stream;
    },
    err => console.log(err)
  );
}


