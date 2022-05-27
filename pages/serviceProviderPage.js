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
    sp: [],
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
    const colRefSer = collection(this.state.db, "ServiceProvider");
    const regisq = query(colRefSer, orderBy("registration"));
    const q=query(colRefSer,orderBy("contractNumber"));
    let conNum = new Array();
    

    onSnapshot(regisq, (snapshot) => {
      this.setState({ allregis: [] });
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
        this.setState({ allregis: [...this.state.allregis, doc.data()] });
      });
    });

    onSnapshot(q, (snapshot) => {
      this.setState({ sp: [] });
      snapshot.docs.forEach((doc) => {
        this.setState({
          sp: [...this.state.sp, doc.data()],
        });
      });
    });

  }

  renderRegistration() {
    const items = this.state.allregis.map((obj, index) => {
      return {
        key: index,
        header: (
          <h5>
           Institute Name: {" "}
            {obj.institute}
             <br></br>Registration Address: {obj.registration}
          </h5>
        ),
        description: (
          <Link route={`/RContract/${obj.registration}`}>
            <a>
              <i className="teal file alternate icon"></i>
              Visit {obj.institute}'s Registration Contract
            </a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  rederContracts() {
    const items = this.state.sp.map((obj, index) => {
      return {
        key: index,
        header: (
          <h5>
          Institute Name: {" "}
            {obj.institute}
             <br></br> 
             Contract Number: {obj.contractNumber}
          </h5>
        ),
        meta:(
            <Link route={`${obj.contract}`}>
            <a>
              <i className="teal file alternate icon"></i>
              View confirmed Contract
            </a>
          </Link>
        ),
        description: (
          <Link route={`/POContract/${obj.po}/${obj.contractNumber}`}>
            <a>
              <i className="teal file alternate icon"></i>
              Visit {obj.institute}'s Purchase
              Order Contract
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
          <h2>ServiceProvider DashBoard</h2>
          <h3>Registration Contracts</h3>
          <div>{this.renderRegistration()}</div>
          <Divider></Divider>

          <h3>Purchase Order Contracts</h3>
          <div>{this.rederContracts()}</div>
        </Segment>
      </Layout>
    );
  }
}

export default GPOIndex;
