import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Grid,
  Container,
  Segment,
} from "semantic-ui-react";
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  where,
  getDoc,
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

import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { Link } from "../routes";
import IndexPage from "./components/IndexPage";
import { async } from "@firebase/util";

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
    account: "",
    account1: "",
  };
  async componentDidMount() {
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
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }

  onSubmitFormSignUp = async (event) => {
    event.preventDefault();
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const selfaddress = accounts[0];
      const insti = this.state.institute;
      console.log(this.state.institute);
      createUserWithEmailAndPassword(
        this.state.auth,
        this.state.mail,
        this.state.password
      )
        .then(async (cred) => {
          console.log("user created ", cred.user);
          const colref = collection(this.state.db, "GPOs");
          await setDoc(doc(this.state.db, "GPOs", selfaddress), {
            institute: insti,
          });
        })
        .catch((err) => {
          this.setState({ errorMessage: err.message });
        });
    } catch (err) {
      console.log(err.message);
    }

    this.setState({ institute: "", password: "", mail: "" });
  };

  render() {
    return (
      <IndexPage>
        <div style={{ margin: "20px" }}>
          <Container>
            <Segment>
              <Form
                onSubmit={this.onSubmitFormSignUp}
                error={!!this.state.errorMessage}
              >
                <Form.Field style={{ marginTop: "20px" }}>
                  <label>Enter Organization name</label>
                  <Input
                    label="institute"
                    labelPosition="right"
                    value={this.state.institute}
                    onChange={(event) =>
                      this.setState({ institute: event.target.value })
                    }
                  ></Input>
                </Form.Field>
                <Form.Field style={{ marginTop: "20px" }}>
                  <label>Mail id</label>
                  <Input
                    label="email"
                    labelPosition="right"
                    placeholder="joe1@gmail.com"
                    value={this.state.mail}
                    onChange={(event) =>
                      this.setState({ mail: event.target.value })
                    }
                  ></Input>
                </Form.Field>
                <Form.Field style={{ marginTop: "20px" }}>
                  <label>Password</label>
                  <Input
                    label="password"
                    type="password"
                    labelPosition="right"
                    value={this.state.password}
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                  ></Input>
                </Form.Field>
                <Button color="teal">Sign Up</Button>
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
              </Form>
            </Segment>
            <Button color="teal">
              <Link route={`/initiate/${this.state.account}`}>
                <h5 style={{ color: "white" }}>
                  Registered..Goto GPO Dashboard
                </h5>
              </Link>
            </Button>
          </Container>
        </div>
      </IndexPage>
    );
  }
}

export default GPOIndex;
