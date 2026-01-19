import { IconCloudUp, IconPencil, IconUser, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { convertBlobToBinaryString, resizeImage } from "lib/image";

type TEncodedFile = {
  name: string;
  size: number;
  encoded: string; // base64 encoded content
  progress?: number;
  id?: string;
  main_img_flag?: boolean;
};

interface dataProps {
  setEncodedFiles: (arg: any) => any;
  encodedFiles: TEncodedFile[];
  selectedCover: number;
  multiple?: boolean;
  label?: string;
  isValidation: boolean;
  setSelectedCover: (...args: any[]) => any;
}

const ProfilePicUpload = ({
  encodedFiles,
  selectedCover,
  setSelectedCover,
  setEncodedFiles,
}: dataProps) => {
  const handleRemoveProduct = (key: number) => {
    setEncodedFiles(encodedFiles.filter((_, i) => i !== key));
  };
  const handleImage = useCallback((file: File, body: string) => {
    return resizeImage(file, body)
      .then((blob: any) => convertBlobToBinaryString(blob))
      .then((imageString) => {
        const imageBase64 = btoa(String(imageString));
        // console.log(imageBase64);
        const tempData = {
          name: file?.name,
          size: imageBase64.length,
          progress: 0,
          encoded: `data:${file.type};base64,${imageBase64}`,
        };
        return tempData;
      });
  }, []);

  const readFile = useCallback(
    (file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result !== null) {
            const ss = event?.target?.result;
            const dataFile = handleImage(file, btoa(String(ss))).then((r) => r);
            // return dataFile;
            return resolve(dataFile);
          }
        };
        reader.readAsBinaryString(file);
      });
    },
    [handleImage]
  );
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("acceptedFiles", acceptedFiles);
      // setErrors(rejectFiles(rejectedFiles)); // set/reset errors
      const encFile: any[] = [];
      for (let index = 0; index < acceptedFiles.length; index++) {
        // const element = array[index];
        const a = await readFile(acceptedFiles[index]);
        encFile.push(a);
      }
      setEncodedFiles([...encFile]);
    },
    [encodedFiles, readFile, setEncodedFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      onDrop(acceptedFiles);
    },
    // maxFiles: maxFiles,
    multiple: true,
  });
  return (
    <>
      <div
        className="d-flex flex-row gap-2 align-items-end"
        // {...getRootProps()}
      >
        {encodedFiles && encodedFiles.length > 0 ? (
          encodedFiles?.map((v, key: number) => (
            <div
              className="position-relative overflow-hidden rounded-2"
              style={{
                border:
                  selectedCover === key
                    ? "2px solid #FF9F43"
                    : "1px solid rgba(145, 158, 171, 0.3)",
                width: "80px",
                height: "80px",
              }}
              key={key}
              onClick={() => setSelectedCover(key)}
            >
              <img src={v.encoded} alt="image" className="object-fit-cover h-100 rounded-1" />
              {/* <Link
                href="#"
                className="position-absolute top-0 end-0"
                // onClick={() => handleRemoveProduct(key)}
              >
                <IconX />
              </Link> */}
            </div>
          ))
        ) : (
          <div className="px-4 py-4 bg-body-secondary text-center rounded-2">
            <IconUser width={32} height={32} />
          </div>
        )}
        <div className="d-flex flex-column gap-1">          
          <button className="btn btn-sm btn-primary" {...getRootProps()}>
            <input {...getInputProps()} className="hidden" />
            <IconCloudUp /> Upload A Photo
          </button>
          <button className="btn btn-square btn-outline-light" onClick={() => handleRemoveProduct(0)}>Remove</button>
        </div>
        {/* <div
              className="profile-pic text-center cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} className="hidden" />
              <span>
                <PlusCircle className="plus-down-add" />
                Profile Photo
              </span>
            </div> */}
      </div>

      {/* <div className="profile-pic-upload mb-2">
        {encodedFiles && encodedFiles.length > 0 ? (
          encodedFiles?.map((v, key: number) => (
            <div
              className="position-relative"
              style={{
                border:
                  selectedCover === key
                    ? "2px solid #FF9F43"
                    : "1px solid rgba(145, 158, 171, 0.3)",
              }}
              key={key}
              onClick={() => setSelectedCover(key)}
            >
              <img src={v.encoded} alt="image" width={120} height={"auto"} />
              <Link
                href="#"
                className="position-absolute top-0 end-0"
                // onClick={() => handleRemoveProduct(key)}
              >
                <IconX />
              </Link>
            </div>
          ))
        ) : (
          <></>
        )}*/}
      {/* <div className="input-blocks mb-0">
          <div className="image-upload mb-0">
            <input type="file" />
            <div className="image-uploads">
              <h4>Change Image</h4>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </>
  );
};
export default ProfilePicUpload;
