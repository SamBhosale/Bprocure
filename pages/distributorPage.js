import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Container,
  Segment,
  Card,
  Divider,
} from "semantic-ui-react";
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
  snapshotEqual,
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
import Layout from "./components/Layout";

class GPOIndex extends Component {
  state = {
    password: "",
    lpassword: "",

    mail: "",
    lmail: "",
    gpo: "",
    pn: "",
    contractNumber: "",

    errorMessage: "",
    allregis: [],
    lerrorMessage: "",
    auth: "",
    db: "",
    account: "",
    con: [],
    distributor: [],
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
    const colRefDis = collection(this.state.db, "Distributor");
    const q = query(colRefDis, where("distributor", "==", this.state.account));
   

    onSnapshot(q, (snapshot) => {
      this.setState({ distributor: [] });
      snapshot.docs.forEach((doc) => {
        this.setState({
          distributor: [...this.state.distributor, doc.data()],
        });
      });
    });
  }

  renderRegistration() {
    const items = this.state.distributor.map((obj, index) => {
      return {
        key: index,
        header: (
          <h5>
           Institute Name: {" "}
            {obj.institute}
             <br></br>GPO Address: {obj.gpo}
             <br></br>Contract Number: {obj.contractNumber}
             <br></br>Purchase Order Number: {obj.poNumber}
             <br></br><a href={obj.spReceipt}>Receipt</a>
          </h5>
        ),
        meta: (
          <Link route={`/POContract/${obj.po}`}>
            <a>
              <i className="teal file alternate icon"></i>
              Visit {obj.institute}'s Purchase Order Contract
            </a>
          </Link>
        ),
        description: (<Link route={`/RebateContract/${obj.rs}`}>
        <a>
          <i className="teal file alternate icon"></i>
          Visit {obj.institute}'s Rebate Contract
        </a>
      </Link>
        ),

        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }


  render() {
    return (
      <Layout>
        <Segment>
          <h2>Distributor DashBoard</h2>
          <h3>Purchase Order Contracts</h3>
          <div>{this.renderRegistration()}</div>
        </Segment>
      </Layout>
    );
  }
}

export default GPOIndex;
