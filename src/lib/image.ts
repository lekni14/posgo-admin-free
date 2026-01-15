// helpers/image.js
import Pica from "pica";

export function resizeImage(file: File, body: string) {
  const pica = Pica();

  const outputCanvas = document.createElement("canvas");
  // this will determine resulting size
  // ignores proper aspect ratio, but could be set dynamically
  // to handle that
  outputCanvas.height = 960;
  outputCanvas.width = 1024;

  return new Promise((resolve) => {
    const img = new Image();

    // resize needs to happen after image is "loaded"
    img.onload = () => {
      resolve(
        pica
          .resize(img, outputCanvas, {
            unsharpAmount: 100,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((result: any) => pica.toBlob(result, "image/jpeg", 0.9))
      );
    };

    img.src = `data:${file.type};base64,${body}`;
    //   return `data:${file.type};base64,${body}`;
    // console.log(img);
  });
}
export function convertBlobToBinaryString(blob: Blob) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onabort = () => {
      reject(new Error("Reading blob aborted"));
    };

    reader.onerror = () => {
      reject(new Error("Error reading blob"));
    };

    reader.readAsBinaryString(blob);
  });
}

