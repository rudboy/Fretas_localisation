import React from "react";
import axios from "axios"; // const axios = require('axios');
import Modal from "./Modal/Modal";
import Login from "./Login";
import Cookies from "js-cookie";
import Formulaire from "./Formulaire";
import "../App.css";

class Administration extends React.Component {
  state = {
    showModal: true,
    userId: Cookies.get("userID") || null,
    token: Cookies.get("token") || null,
    userName: Cookies.get("userName") || null,
    modalResponse: ""
  };

  async componentDidMount() {}

  deletecookie = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("userID");
    this.setState({ userId: null, token: null, userName: null });
  };

  setUserId = (token, id, user) => {
    this.setState({
      token: token,
      userId: id,
      userName: user,
      showModal: true
    });

    Cookies.set("token", token, { expires: 7 });
    Cookies.set("userName", user, { expires: 7 });
    Cookies.set("userID", id, { expires: 7 });
  };

  getResponse = response => {
    this.setState({ modalResponse: response });
    this.closeModalHandler("null");
  };

  openModalHandler = () => {
    this.setState({
      showModal: true,
      modalResponse: ""
    });
  };

  closeModalHandler = response => {
    this.setState({
      showModal: false
    });
    if (response.token) {
      this.setUserId(response.token, response._id, response.account.username);
    }
  };

  render() {
    return (
      <div className="golbalcontent">
        {this.state.modalResponse !== "" ? (
          <div className="formulaireContenair">
            <Formulaire
              formu={this.state.modalResponse}
              open={this.openModalHandler}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="modalContenaire">
          {!this.state.userId ? (
            <Modal
              className="modal"
              show={this.state.showModal}
              close={this.closeModalHandler}
              title={"Connexion"}
            >
              <Login close={this.closeModalHandler} />
            </Modal>
          ) : (
            <>
              <header className="headerTitle">
                {"Bienvenue " + this.state.userName}
              </header>

              <Modal
                className="modal"
                show={this.state.showModal}
                close={this.closeModalHandler}
                title={"Menu"}
              >
                <ul>
                  <li
                    className="liste"
                    onClick={() => this.getResponse("add_driver")}
                  >
                    Ajouter un conducteur
                  </li>
                  <li
                    className="liste"
                    onClick={() => this.getResponse("delete_driver")}
                  >
                    supprimer un conducteur
                  </li>
                  <li
                    className="liste"
                    onClick={() => this.getResponse("add_car")}
                  >
                    Ajouter une voiture
                  </li>
                  <li
                    className="liste"
                    onClick={() => this.getResponse("delete_car")}
                  >
                    supprimer une voiture
                  </li>
                </ul>
                <button className="valider" onClick={this.deletecookie}>
                  Deconnexion
                </button>
              </Modal>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Administration;
