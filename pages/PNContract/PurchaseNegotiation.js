import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Grid,
  Divider,
  Segment,
} from "semantic-ui-react";
import Layout from "../components/Layout";
import PurchaseNegotiationCon from "../../ethereum/PurchaseNegotiationCon";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  where,
  getDoc,
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

class PurchaseNegotiation extends Component {
  state = {
    productId: "",
    quantity: "",
    manufacturerAdd: "",
    contractNumberNC: "",
    contractNumberCS: "",
    contractNumberAD: "",
    object:[],
    distributorAdd: "",
    price: "",
    statusCon: false,
    loadingNC: false,
    loadingNegoC: false,
    loadingCS: false,
    loadingAD: false,
    errorMessageNC: '',
    errorMessageNegoC: '',
    errorMessageCS: '',
    errorMessageAD: '',
    auth:'',
    db:''
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

  onSubmitNewContract = async (event) => {
    event.preventDefault();
    this.setState({ loadingNC: true });
    this.setState({
      errorMessageNC: '',
    });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const selfaddress=accounts[0];
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .newContract(
          this.state.productId,
          this.state.quantity,
          this.state.manufacturerAdd
        )
        .send({
          from: accounts[0],
        });
        const conNum=await purchaseNegotiationCon.methods.contractAddresses().call();
      const docRef = doc(this.state.db, "GPOs", selfaddress);
        let instituteName,pn;
        await getDoc(docRef).then((doc) => {
          instituteName = doc.data().institute;
          pn=doc.data().pn;
        });
        const colRef = collection(this.state.db, "Manufacturer");
      addDoc(colRef, {
        institute:instituteName,
          pn:pn,
          gpo:selfaddress,
          contractNumber:conNum,
          manufacturer:this.state.manufacturerAdd,
          rebateAsked:"false"
      }).then(() => {
        console.log("added");
      });
    } catch (err) {
      this.setState({
        errorMessageNC: err.message,
      });
    }
    this.setState({ loadingNC: false });
  };

  onSubmitNegotiateContract = async (event) => {
    event.preventDefault();
    this.setState({ loadingNegoC: true });
    this.setState({
      errorMessageNegoC: '',
    });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .negotiateContract(this.state.contractNumberNC, this.state.price)
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({
        errorMessageNegoC: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingNegoC: false });
  };

  onSubmitContractStatus = async (event) => {
    event.preventDefault();
    this.setState({ loadingCS: true });
    this.setState({
      errorMessageCS: '',
    });
    try {
      console.log("i am here");
      console.log(this.state.statusCon);
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);
      await purchaseNegotiationCon.methods
        .contractStatus(this.state.contractNumberCS, this.state.statusCon)
        .send({
          from: accounts[0],
        });

    } catch (err) {
      this.setState({
        errorMessageCS: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingCS: false });
  };

  onSubmitAssignDistributor = async (event) => {
    event.preventDefault();
    this.setState({ loadingAD: true });
    this.setState({
      errorMessageAD: '',
    });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);
      const selfaddress=accounts[0];
      await purchaseNegotiationCon.methods
        .assignDistributor(
          this.state.contractNumberAD,
          this.state.distributorAdd
        )
        .send({
          from: accounts[0],
        });
        // connect to Moralis server
      const serverUrl = "https://cz3jtmvkkbfb.usemoralis.com:2053/server";
      const appId = "tXkGqu6o3wMPDp1yC4UFojswibJAYNFx8XdDAvIh";
      await Moralis.start({ serverUrl, appId });
        //signing in to moralis
        await Moralis.authenticate().then(function (user) {
          console.log('logged in')
          });
        //fetched contract object
        this.state.object = await purchaseNegotiationCon.methods
        .contracts(this.state.contractNumberAD)
        .call();

        const docRef = doc(this.state.db, "GPOs", selfaddress);
        let instituteName,registration;
        await getDoc(docRef).then((doc) => {
          instituteName = doc.data().institute;
          registration=doc.data().registration;
        });
        // metadata to be uploaded
        const contractDetails={
          "Product Id":this.state.object[2],
          "Price":this.state.object[4],
          "Manufacturer Address":this.state.object[0],
          "Distributor Address":this.state.object[1],
          "Contract Status":"Confirmed & distributor assigned"
        }
      //uploading metadata
      const file = await new Moralis.File("file.json",{base64:btoa(JSON.stringify(contractDetails))});
      await file.saveIPFS();
      const urlAt=await file.ipfs();
        let poAtsp;
      const docRefgpo=doc(this.state.db,"GPOs",selfaddress);
        await getDoc(docRefgpo).then((doc)=>{
          poAtsp=doc.data().po;
        })
        console.log("po address",poAtsp)
        if(poAtsp === undefined){
        poAtsp=0;
        }
        

        const colRefServiceP = collection(this.state.db, "ServiceProvider");  // anyone can see
        addDoc(colRefServiceP, {
          institute:instituteName,
            gpo:selfaddress,
            contractNumber:this.state.contractNumberAD,
            contract:urlAt,
            po:poAtsp
        }).then(() => {
          console.log("added");
        });

        const colRefMan = collection(this.state.db,"Manufacturer");
        const q=query(colRefMan,where("contractNumber","==",this.state.contractNumberAD));
        let id = '';
      await getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          id=doc.id;
        });
      });

      const docM = doc(this.state.db, "Manufacturer", id);
        await updateDoc(docM, { distributor:this.state.distributorAdd,contractAt:urlAt }).then(() => {
          console.log("added distributor");
        });
        
        

    } catch (err) {
      this.setState({
        errorMessageAD: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingAD: false });
  };

  render() {
    return (
      <Layout>
        <div>
          <Link route={`/PNContract/LoadContract/${this.props.address}`}>
            <a>
              <Button color="teal" floated="right">
                Load Contract
              </Button>
            </a>
          </Link>
          <h3>Purchase Negotiation Forms</h3>
        </div>
        <Segment>
          <Grid columns={1} divided>
            {/* New Contract Code */}
            <Grid.Row>
              <Grid.Column>
                <h5>New Contract (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitNewContract}
                  error={!!this.state.errorMessageNC}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Product Id</label>
                    <Input
                      label="id"
                      labelPosition="right"
                      value={this.state.productId}
                      onChange={(event) =>
                        this.setState({ productId: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Quantity</label>
                    <Input
                      label="quantity"
                      labelPosition="right"
                      value={this.state.quantity}
                      onChange={(event) =>
                        this.setState({ quantity: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Manufacturer's Address</label>
                    <Input
                      label="address"
                      labelPosition="right"
                      value={this.state.manufacturerAdd}
                      onChange={(event) =>
                        this.setState({ manufacturerAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingNC} color="teal">
                    New Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageNC}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <br></br>
          <Divider section />
          <br></br>

          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                {/* Negotiate Contract Code */}
                <h5>Negotiate Contract (Manufacturer)</h5>
                <Form
                  onSubmit={this.onSubmitNegotiateContract}
                  error={!!this.state.errorMessageNegoC}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberNC}
                      onChange={(event) =>
                        this.setState({ contractNumberNC: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Price</label>
                    <Input
                      label="price"
                      labelPosition="right"
                      value={this.state.price}
                      onChange={(event) =>
                        this.setState({ price: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingNegoC} color="teal">
                    Negotiate Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageNegoC}
                  />
                </Form>
              </Grid.Column>

              <Grid.Column>
                {/*Contract Status Code*/}
                <h5>Contract Status (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitContractStatus}
                  error={!!this.state.errorMessageCS}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberCS}
                      onChange={(event) =>
                        this.setState({ contractNumberCS: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Do you Accept The Price</label>
                    <Input
                      label="true/false"
                      labelPosition="right"
                      value={this.state.statusCon}
                      onChange={(event) =>
                        this.setState({ statusCon: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingCS} color="teal">
                    Update Status
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageCS}
                  />
                </Form>
              </Grid.Column>

              <Grid.Column>
                {/*Assign Distributor Code*/}
                <h5>Assign Distributor (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitAssignDistributor}
                  error={!!this.state.errorMessageAD}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberAD}
                      onChange={(event) =>
                        this.setState({ contractNumberAD: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Distributor's Address</label>
                    <Input
                      label="address"
                      labelPosition="right"
                      value={this.state.distributorAdd}
                      onChange={(event) =>
                        this.setState({ distributorAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Button loading={this.state.loadingAD} color="teal">
                    Assign Distributor
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageAD}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Layout>
    );
  }
}
export default PurchaseNegotiation;
