/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxImportSource @emotion/react */
import { css, Global } from "@emotion/react";
import * as tmImage from "@teachablemachine/image";
import { useEffect, useRef, useState } from "react";
import GlobalStyles from "./styles/GlobalStyles";

const URL = "https://teachablemachine.withgoogle.com/models/iOUGXJgMS/";

function App() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [maxPredictions, setMaxPredictions] = useState<number>(0);
  const [image, setImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<string[]>();

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 모델 초기화 로직
    const init = async () => {
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      // 모델과 메타데이터 로드
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());

      if (resultRef.current) {
        for (let i = 0; i < maxPredictions; i++) {
          resultRef.current.appendChild(document.createElement("div"));
        }
      }
    };

    init();
  }, []);

  // 예측
  const predict = async () => {
    // 업로드한 이미지를 바탕으로 모델이 예측
    if (model && image) {
      const imgElement = document.createElement("img");
      imgElement.src = image;
      const prediction = await model.predict(imgElement, false);

      const arr = [];

      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);

        arr.push(classPrediction);
      }

      // 예측 결과를 화면에 렌더링
      setResult(arr);
    } else if (!model) {
      alert("모델이 존재하지 않습니다!");
    }
  };

  // 파일 업로드 - 드래그 앤 드롭 로직
  const handleDragEnter = () => setIsActive(true);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDragLeave = () => setIsActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 업로드 - 클릭 로직
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제
  const handleRemove = () => {
    setImage(null);
    setResult([]);
  };

  return (
    <>
      <Global styles={GlobalStyles} />
      <main css={mainStyle}>
        {/* 모델 */}
        <section>
          <h1 css={titleStyle}>AI를 활용한 뇌출혈 예측</h1>
        </section>

        {/* 파일 업로드 */}
        <section>
          <div css={uploaderStyle}>
            {image ? (
              <div css={imgContainerStyle}>
                <img src={image} alt="업로드 이미지" />
                <button
                  type="button"
                  css={buttonStyles("reset")}
                  onClick={handleRemove}
                >
                  이미지 삭제
                </button>
              </div>
            ) : (
              <label
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                css={labelStyle(isActive)}
              >
                <input
                  css={css`
                    display: none;
                  `}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                />
                클릭하거나 이 곳에 이미지를 드래그 앤 드롭하세요
              </label>
            )}
          </div>
        </section>

        {/* 결과 */}
        <section>
          {image && (
            <div css={resultContainerStyle}>
              <button
                type="button"
                css={buttonStyles("default")}
                onClick={predict}
              >
                예측하기
              </button>
              {result && result.length > 0 && (
                <div css={resultStyle} ref={resultRef}>
                  {result.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

const mainStyle = css`
  padding-top: 5rem;
  box-sizing: border-box;

  section {
    width: 100%;
    margin-bottom: 3rem;

    :last-child {
      margin-bottom: unset;
    }
  }
`;

const titleStyle = css`
  text-align: center;
  font-size: 3.2rem;
  font-weight: 600;
  margin-bottom: 2rem;

  ::before {
    content: "";
    display: block;
    width: 18rem;
    height: 18rem;
    margin: 0 auto;
    margin-bottom: 2rem;
    background-image: url("/img-ct-scan.png");
    background-repeat: no-repeat;
    background-size: contain;
  }

  @media (max-width: 1023px) {
    font-size: 2.4rem;
  }
`;

const buttonStyles = (props: "reset" | "default") => css`
  width: 10rem;
  padding: 1rem 1.2rem;
  box-sizing: border-box;
  border-radius: 0.8rem;
  background-color: ${props === "reset" ? "#FE7108" : "#3F3F3F"};
  color: #fff;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: ${props === "default" ? "#717171" : "#FE900C"};
    color: ${props === "reset" && "#1E1E1E"};
  }
`;

const uploaderStyle = css`
  width: 100%;
  max-width: 60rem;
  height: 30rem;
  margin: 0 auto;
  padding: 0 3rem;
  box-sizing: border-box;
`;

const imgContainerStyle = css`
  width: 100%;
  height: 100%;

  padding: 1rem;
  box-sizing: border-box;
  border: 0.2rem dashed black;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  img {
    width: 30rem;
    height: 20rem;
    object-fit: contain;
  }
`;

const labelStyle = (isActive: boolean) => css`
  cursor: pointer;
  width: 100%;
  height: 100%;
  text-align: center;

  padding: 1rem;
  box-sizing: border-box;
  border: 0.2rem dashed black;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  font-size: 1.6rem;
  font-weight: 600;

  background-color: ${isActive && "#ECECEC"};

  ::before {
    content: " ";
    width: 6rem;
    height: 6rem;
    background-image: url("/icon-add-photo.svg");
    background-repeat: no-repeat;
    background-size: cover;
  }
`;

const resultContainerStyle = css`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 0 3rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const resultStyle = css`
  width: 100%;
  padding: 1rem;
  background-color: #ececec;
  box-sizing: border-box;
  border-radius: 0.8rem;
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;

  p {
    font-size: 1.6rem;
    font-weight: 600;
  }
`;

export default App;
