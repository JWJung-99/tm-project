/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const GlobalStyles = css`
  /* Reset */
  body,
  h1 {
    margin: unset;
    font-size: unset;
    font-weight: unset;
  }

  img {
    vertical-align: top;
    max-width: 100%;
  }

  button {
    all: unset;
    cursor: pointer;
  }

  /* Typography */
  @font-face {
    font-family: "Pretendard";
    font-weight: 400;
    src: url("@/assets/fonts/PretendardVariable.woff2") format("woff2");
    font-display: swap;
  }

  :root {
    font-size: 10px;
  }

  body {
    font-family: "Pretendard", sans-serif;
    font-size: 1.4rem;
  }

  /* Style */
  :root {
    min-width: 320px;
    min-height: 100svh;
    background-color: white;
  }

  body {
    padding: 0 2.4rem;

    @media (max-width: 1023px) {
      padding: 0 1.6rem;
    }
  }
`;

export default GlobalStyles;
