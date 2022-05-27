import React, { Component } from "react";
import {
  Form,
  Button,
  Icon,
  Message,
  Card,
  Segment,
  Divider,
} from "semantic-ui-react";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import Layout from "./components/Layout";
import { Link, Router } from "../routes";
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
  limit,
  setDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

class GPOcontracts extends Component {
  state = {
    errorMessage: "",
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    loading5: false,
    add: [],
    auth: "",
    db: "",
    contractName: [
      "Registration",
      "Purchase Negotiation",
      "Purchase Order",
      "Rebate Settlement",
      "Loyalty Rebate",
    ],
    routesFolder: [
      "/RContract/",
      "/PNContract/",
      "/POContract/",
      "/RebateContract/",
      "/LoyaltyContract/",
    ],
  };
  static async getInitialProps(props)
  {
    const {address} = props.query;
    return {address};

  }

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
    try {
      const accounts = await web3.eth.getAccounts();
      const add1 = [];
      for (let i = 0; i < 5; i++) {
        const address = await factory.methods
          .deployedRegistrationContracts(this.props.address, i)
          .call();
        const emptyAddress = /^0x0+$/.test(address);
        if (!emptyAddress) add1.push(address);
      }

      this.setState({ add: add1 });
    } catch (err) {
      this.setState({
        errorMessage:
          "your metaMask account is not connected to this site, kindly connect",
      });
    }
  }

  onRegistration = async (event) => {
    event.preventDefault();
    this.setState({ loading1: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const selfaddress = accounts[0];
      await factory.methods.createRegistration().send({
        from: accounts[0],
      });
      const regisAdd = await factory.methods
        .deployedRegistrationContracts(accounts[0], 0)
        .call();
      this.state.add.push(regisAdd);
      const docRef = doc(this.state.db, "GPOs", selfaddress);
      updateDoc(docRef, {
        registration: regisAdd,
      });
      let instituteName;
      await getDoc(docRef).then((doc) => {
        instituteName = doc.data().institute;
      });
      const colRef = collection(this.state.db, "Manufacturer");
      addDoc(colRef, {
        institute: instituteName,
        gpo: selfaddress,
        registration: regisAdd,
      }).then(() => {
        console.log("added");
      });
      const colRefSer = collection(this.state.db, "ServiceProvider");
      addDoc(colRefSer, {
        institute: instituteName,
        gpo: selfaddress,
        registration: regisAdd,
      }).then(() => {
        console.log("added");
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading1: false });
  };

  onPurchseNegotiation = async (event) => {
    event.preventDefault();
    this.setState({ loading2: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const selfaddress = accounts[0];
      await factory.methods.createPurchaseNegotiations().send({
        from: accounts[0],
      });
      const pnAdd = await factory.methods
        .deployedRegistrationContracts(accounts[0], 1)
        .call();
      this.state.add.push(pnAdd);
      const docRef = doc(this.state.db, "GPOs", selfaddress);
      updateDoc(docRef, {
        pn: pnAdd,
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading2: false });
  };

  onPurchseOrder = async (event) => {
    event.preventDefault();
    this.setState({ loading3: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const selfaddress = accounts[0];
      await factory.methods.createPurchaseOrders().send({
        from: accounts[0],
      });
      const poAdd = await factory.methods
        .deployedRegistrationContracts(accounts[0], 2)
        .call();
      this.state.add.push(poAdd);
      const docRef = doc(this.state.db, "GPOs", selfaddress);
      updateDoc(docRef, {
        po: poAdd,
      });

      const colRefSer = collection(this.state.db, "ServiceProvider");
      const q = query(colRefSer, where("gpo", "==", selfaddress));
      let ids = new Array();
      await getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          ids.push(doc.id);
        });
      });
      for (let i = 0; i < ids.length; i++) {
        const docR = doc(this.state.db, "ServiceProvider", ids[i]);
        await updateDoc(docR, { po:poAdd }).then(() => {
          console.log("added po");
        });
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading3: false });
  };

  onRebateSettlement = async (event) => {
    event.preventDefault();
    this.setState({ loading4: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const selfaddress = accounts[0];
      await factory.methods.createRebatesSettelment().send({
        from: accounts[0],
      });
      const rsAdd = await factory.methods
        .deployedRegistrationContracts(accounts[0], 3)
        .call();
      this.state.add.push(rsAdd);
      const docRef = doc(this.state.db, "GPOs", selfaddress);
      updateDoc(docRef, {
        rs: rsAdd,
      });
      const colRefSer = collection(this.state.db, "Manufacturer");
      const q = query(colRefSer, where("gpo", "==", selfaddress),orderBy("registration"),limit(1));
      let id;
      await getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          id=doc.id;
        });
      });
      const docR = doc(this.state.db, "Manufacturer", id);
        await updateDoc(docR, { rs: rsAdd }).then(() => {
          console.log("added rs");
        });

        const colRefDis = collection(this.state.db, "Distributor");
      const qd = query(colRefDis, where("gpo", "==", selfaddress));
      let idd;
      await getDocs(qd).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          idd=doc.id;
        });
      });
      const docRd = doc(this.state.db, "Distributor", idd);
        await updateDoc(docRd, { rs: rsAdd }).then(() => {
          console.log("added rs");
        });



    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading4: false });
  };

  onLoyaltyRebate = async (event) => {
    event.preventDefault();
    this.setState({ loading5: true });
    try {
      const accounts = await web3.eth.getAccounts();
      const selfaddress = accounts[0];

      await factory.methods.createLoyaltyRebates().send({
        from: accounts[0],
      });
      const lrAdd = await factory.methods
        .deployedRegistrationContracts(accounts[0], 4)
        .call();
      this.state.add.push(lrAdd);
      const docRef = doc(this.state.db, "GPOs", selfaddress);
      updateDoc(docRef, {
        lr: lrAdd,
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading5: false });
  };

  details = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();

      const det1 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 0)
        .call();
      const det2 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 1)
        .call();
      const det3 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 2)
        .call();
      const det4 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 3)
        .call();
      const det5 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 4)
        .call();

      console.log(det1, det2, det3, det4, det5);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  rederContracts() {
    const index = -1;
    const items = this.state.add.map((address) => {
      index++;
      return {
        header: address,
        description: (
          <Link route={`${this.state.routesFolder[index]}${address}`}>
            <a>
              <i className="teal file alternate icon"></i>
              Visit {this.state.contractName[index]}
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
          <h3>Contract Creation</h3>
          <Form error={!!this.state.errorMessage}>
            <Button
              loading={this.state.loading1}
              color="teal"
              onClick={this.onRegistration}
            >
              Registration
            </Button>
            <Button
              loading={this.state.loading2}
              color="teal"
              onClick={this.onPurchseNegotiation}
            >
              Purchase Negotiation
            </Button>
            <Button
              loading={this.state.loading3}
              color="teal"
              onClick={this.onPurchseOrder}
            >
              Purchase Order
            </Button>
            <Button
              loading={this.state.loading4}
              color="teal"
              onClick={this.onRebateSettlement}
            >
              Rebate Settlement
            </Button>
            <Button
              loading={this.state.loading5}
              color="teal"
              onClick={this.onLoyaltyRebate}
            >
              Loyalty Rebate
            </Button>

            <Button primary onClick={this.details}>
              Show All Contracts
            </Button>
            <Message error header="Oops!" content={this.state.errorMessage} />
          </Form>
          <Divider section />

          <div>{this.rederContracts()}</div>
        </Segment>
      </Layout>
    );
  }
}
export default GPOcontracts;
