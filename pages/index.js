import React, { Component } from "react";
import {
  Form,
  Button,
  Grid,
  Input,
  Message,
  Container,
  Segment,
  Header,
  Image,
  Divider,
  Menu,
} from "semantic-ui-react";

import web3 from "../ethereum/web3";
import { Link } from "../routes";
import IndexPage from "./components/IndexPage";

class GPOIndex extends Component {
  state = {
    password: "",
    lpassword: "",

    mail: "",
    lmail: "",

    institute: "",
    errorMessage: "",
    lerrorMessage: "",
    auth: "",
    db: "",
  };

  render() {
    return (
      <IndexPage>
        <div style={{ margin: "20px" }}>
          <Header as="h1">
            <Image
              circular
              src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-supply-chain-circular-economy-flaticons-lineal-color-flat-icons-2.png"
            ></Image>
            <span style={{ margin: "10px", color: "orange" }}> B-PROCURE</span>
            <Divider></Divider>
          </Header>
          <Container>
            <Grid columns={4}>
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Button secondary>
                    <Link route={"/gpoPage/"}>
                      <h4 style={{ color: "white" }}>GPO</h4>
                    </Link>
                  </Button>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Button color="teal">
                    <Link route={"/manufacturerPage/"}>
                      <h4 style={{ color: "white" }}>Manufacturer</h4>
                    </Link>
                  </Button>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Button color="teal">
                    <Link route={"/serviceProviderPage/"}>
                      <h4 style={{ color: "white" }}>Service Provider</h4>
                    </Link>
                  </Button>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Button color="teal">
                    <Link route={"/distributorPage/"}>
                      <h4 style={{ color: "white" }}>Distributor</h4>
                    </Link>
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column>
              <Segment>
                <h1 style={{ margin: "5px", color: "orange" }}>A Pilot Project.....</h1>
                <h2 style={{ margin: "5px", color: "orange" }}>What Do We Do?</h2>
                <ul>
                  <li><h3>
                    We provide a blockchain based platform for business
                    procurement on ethereum smart contracts</h3>
                  </li>
                  <li><h3>We aim to ensure transparency among trading partners</h3></li>
                  <li>
                  <h3>We aim to ensures working capital and liquidity to all stake
                    holders</h3>
                  </li>
                  <li><h3>We provide functionality to store contract metadata on IPFS</h3></li>
                </ul>
                </Segment>
              </Grid.Column>
              
              <Grid.Column>
              <Segment>
                <h1 style={{ margin: "5px", color: "orange" }}>How to use this DApp.....</h1>
                <h2 style={{ margin: "5px", color: "orange" }}>You must have MetaMask account</h2>
                <ul>
                  <li>
                  <h3>GPO purchases goods from manufacturer on behalf of Service providers</h3> 
                  </li>
                  <li><h3>Service Providers and Manufacturer register themselves in Contract</h3></li>
                  <li><h3>Purchase is made and on decided price Service Provider issues Purchase Order</h3></li>
                  <li>
                  <h3>Distributor is registered by GPO and is asked to deliver confirmed contract to Service Providers
                  </h3></li>

                </ul>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </IndexPage>
    );
  }
}

export default GPOIndex;
