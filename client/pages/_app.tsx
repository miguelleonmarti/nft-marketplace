import "../styles/globals.css";
import type { AppProps } from "next/app";
import Web3Wrapper from "../components/Web3Wrapper";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Wrapper>
      <Component {...pageProps} />
    </Web3Wrapper>
  );
}

export default MyApp;
