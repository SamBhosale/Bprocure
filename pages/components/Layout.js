import React from "react";
import { Container } from "semantic-ui-react";
import Head from "next/head";
import Header from "./Header";

const Layout = (props) => {
  return (
    <div>
      <Container>
        <Head>
          <link
            async
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
          />
          <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
          <script src="https://unpkg.com/moralis/dist/moralis.js"></script>
        </Head>
        <Header />
        {props.children}
      </Container>
    </div>
  );
};
export default Layout;
