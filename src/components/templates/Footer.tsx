import { layoutContainerWidthStyle } from "../RootLayout";

export default function Footer() {
  return (
    <div
      className={`fixed bottom-0 flex justify-between items-center px-8 py-6 bg-neutral-800 ${layoutContainerWidthStyle}`}
    >
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex gap-4 text-neutral-500 font-bold">
          <a href="http://www.hanteoglobal.com/" target="_blank">
            Company Introduction
          </a>
          <a
            href="https://view.officeapps.live.com/op/view.aspx?src=https://resource.hanteochart.io/qna/%ED%95%9C%ED%84%B0%EC%B0%A8%ED%8A%B8_%EB%AC%B8%EC%9D%98%EC%8B%A0%EC%B2%AD%EC%84%9C.docx"
            target="_blank"
          >
            Partnership
          </a>
        </div>
        <div className="font-normal text-neutral-600">
          <div>Copyright ⓒ HANTEO GLOBAL, Inc. All Rights Reserved</div>
        </div>
      </div>
      <div>
        <div className="w-32 h-20">
          <img
            className="img"
            src="https://www.hanteochart.com/static/media/copyright_logo_en.d6b2417c3c3352031e33.png"
            alt="저작권 OK 로고"
          />
        </div>
      </div>
    </div>
  );
}
