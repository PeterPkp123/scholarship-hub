import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Inter as FontSans } from "next/font/google";
import "~/styles/globals.css";
import Head from "next/head";
import { Toaster } from "~/components/ui/toast";

const font = FontSans({ variable: "--font-sans" });

const App: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${font.style.fontFamily};
          }
        `}
      </style>

      <Head>
        <title>Scholarship Hub</title>
        <meta
          name="description"
          content={
            'Project wykonany w ramach stypendium "Śląskie. Inwestujemy w talenty"'
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${font.className} ${font.variable}`}>
        <Component {...pageProps} />
      </div>

      <Toaster />
    </>
  );
};

export default api.withTRPC(App);
