const button = document.getElementById('btn');

const takeScreen = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  navigator.mediaDevices
    .getDisplayMedia()
    .then((stream) => {
      let track = stream.getVideoTracks()[0];
      let capture = new ImageCapture(track);
      capture.grabFrame().then((bitmap) => {
        track.stop();

        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext('2d').drawImage(bitmap, 0, 0);

        canvas.toBlob(async (blob) => {
          console.log('output blob:', blob);

          const formData = new FormData();

          formData.append('screen', blob);

          await fetch('http://localhost:5000/screen', {
            method: 'POST',
            body: formData,
          });
        });
      });
    })
    .catch((e) => console.log(e));
};

button.addEventListener('click', takeScreen);
