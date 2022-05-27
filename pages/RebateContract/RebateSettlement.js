import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Segment,
  Divider,
  Grid,
} from "semantic-ui-react";
import Layout from "../components/Layout";
import RebateSettlement from "../../ethereum/RebateSettlementCon";
import web3 from "../../ethereum/web3";
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

class Registration extends Component {
  state = {
    manufacturerAdd: "",
    amount: "",
    distributorAdd: "",
    loadingRR: false,
    loadingAR: false,
    errorMessageAR: "",
    errorMessageRR: "",
    contractAdd: "",
    contractAddAR: "",
    bonus: "",
  };
  async componentDidMount()
  {
    const firebaseConfig = {
      // apiKey: "AIzaSyDTzxKgz8d5f5DSJnLkGPtsSPRDoNMlfxU",
      // authDomain: "bpro-da9ad.firebaseapp.com",
      // projectId: "bpro-da9ad",
      // storageBucket: "bpro-da9ad.appspot.com",
      // messagingSenderId: "227407014941",
      // appId: "1:227407014941:web:b36138e58e19d2b0b96af4",
      apiKey: "AIzaSyCRK14MdMc5f2wMTSOpABtESY6vZCS8nCc",
      authDomain: "supplychain-bd310.firebaseapp.com",
      projectId: "supplychain-bd310",
      storageBucket: "supplychain-bd310.appspot.com",
      messagingSenderId: "55277626",
      appId: "1:55277626:web:6a4fcb85117adb58dedd03",

    };
    initializeApp(firebaseConfig); // initialize app

    const d = getFirestore(); // initialize service
    const aut = getAuth();
    this.setState({ auth: aut });
    this.setState({ db: d });
  }
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmitRebateRequest = async (event) => {
    event.preventDefault();
    this.setState({ loadingRR: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const rebateSettlement = RebateSettlement(this.props.address);

      await rebateSettlement.methods
        .submitRebateRequest(
          this.state.contractAdd,
          this.state.amount,
          this.state.manufacturerAdd
        )
        .send({
          from: accounts[0],
        });
        const colRefMan = collection(this.state.db,"Manufacturer");
        const q=query(colRefMan,where("contractNumber","==",this.state.contractAdd));
        let id = '';
      await getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          id=doc.id;
        });
      });

      const docM = doc(this.state.db, "Manufacturer", id);
        await updateDoc(docM, { rebateAsked:"true" }).then(() => {
        });
    } catch (err) {
      this.setState({ errorMessageRR: err.message });
    }
    this.setState({ loadingRR: false });
  };

  onSubmitApproveRequest = async (event) => {
    event.preventDefault();
    this.setState({ loadingAR: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const rebateSettlement = RebateSettlement(this.props.address);

      await rebateSettlement.methods
        .approveRebateRequest(
          this.state.contractAddAR,
          this.state.distributorAdd
        )
        .send({
          from: accounts[0],
          value: this.state.bonus,
        });
    } catch (err) {
      this.setState({ errorMessageAR: err.message });
    }
    this.setState({ loadingAR: false });
  };

  render() {
    return (
      <Layout>
        <h3>Rebate Settlement Form</h3>
        <Segment>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <h5>Rebate Request (Distrubutor)</h5>
                <Form
                  onSubmit={this.onSubmitRebateRequest}
                  error={!!this.state.errorMessageRR}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractAdd}
                      onChange={(event) =>
                        this.setState({ contractAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Amount To Be Paid</label>
                    <Input
                      label="wei"
                      labelPosition="right"
                      value={this.state.amount}
                      onChange={(event) =>
                        this.setState({ amount: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Manufacturer's Address</label>
                    <Input
                      label="Address"
                      labelPosition="right"
                      value={this.state.manufacturerAdd}
                      onChange={(event) =>
                        this.setState({ manufacturerAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessageRR}
                  />
                  <Button loading={this.state.loadingRR} color="teal">
                    Submit
                  </Button>
                </Form>
              </Grid.Column>
              <Grid.Column>
                <h5>Approve Rebate Request (Manufacturer)</h5>
                <Form
                  onSubmit={this.onSubmitApproveRequest}
                  error={!!this.state.errorMessageAR}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractAddAR}
                      onChange={(event) =>
                        this.setState({ contractAddAR: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Bonus Amount</label>
                    <Input
                      label="wei"
                      labelPosition="right"
                      value={this.state.bonus}
                      onChange={(event) =>
                        this.setState({ bonus: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Distributor's Address</label>
                    <Input
                      label="Address"
                      labelPosition="right"
                      value={this.state.distributorAdd}
                      onChange={(event) =>
                        this.setState({ distributorAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessageAR}
                  />
                  <Button loading={this.state.loadingAR} color="teal">
                    Approve
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Layout>
    );
  }
}
export default Registration;
