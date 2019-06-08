import React from "react";
import axios from "axios"; // const axios = require('axios');
import "../App.css";
import domtoimage from "dom-to-image";
const QRCode = require("qrcode.react");

class Formulaire extends React.Component {
  state = {
    nom: "",
    prenom: "",
    username: "",
    password: "",
    Marque: "",
    Model: "",
    immatriculation: "",
    pictures: []
  };

  async componentDidMount() {}

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    if (this.props.formu === "add_car") {
      var node = document.getElementById("section-to-print");
      domtoimage
        .toPng(node)
        .then(
          (this.addCar = async DataUrl => {
            let tabImg = [];
            tabImg.push(DataUrl);
            const response = await axios.post(
              "https://fretas-api.herokuapp.com/add_cars",
              {
                marque: this.state.Marque,
                modele: this.state.Model,
                immatriculation: this.state.immatriculation,
                pictures: tabImg
              }
            );
            if (response.data === "New car Added") {
              alert("Nouvelle Voiture Ajouter");
              //mise a jour APP
              this.setState({
                Marque: "",
                Model: "",
                immatriculation: ""
              });

              this.props.open();
            } else {
              alert(response.data);
            }
          })
        )

        .catch(function(error) {
          console.error("oops, something went wrong!", error);
        });
    } else {
      try {
        const response = await axios.post(
          this.props.formu === "add_driver"
            ? "https://fretas-api.herokuapp.com/sign_up"
            : this.props.formu === "delete_car"
            ? "https://fretas-api.herokuapp.com/delete_car"
            : this.props.formu === "delete_driver"
            ? "https://fretas-api.herokuapp.com/delete_user"
            : "",
          {
            nom: this.state.nom,
            prenom: this.state.prenom,
            username: this.state.username,
            password: this.state.password,
            immatriculation: this.state.immatriculation
          }
        );
        if (response.data.token) {
          alert("Nouveau Conducteur Ajouter");
          //mise a jour APP
          this.setState({
            nom: "",
            prenom: "",
            username: "",
            password: "",
            Marque: "",
            Model: "",
            immatriculation: ""
          });

          this.props.open();
        } else {
          alert(response.data);
        }
      } catch (error) {
        this.setState({
          error: true
        });
      }
    }
  };
  cancel = () => {
    this.setState({
      nom: "",
      prenom: "",
      username: "",
      password: "",
      Marque: "",
      Model: "",
      immatriculation: ""
    });

    this.props.open();
  };

  QrdPrint = () => {};

  screenRender = () => {
    if (this.props.formu === "add_driver") {
      return (
        <>
          <div className="add_driver">
            <h1>Ajouter un Conduceur</h1>

            <p>Nom</p>
            <input
              className="username"
              type="text"
              name="nom"
              value={this.state.nom}
              onChange={this.handleChange}
            />
            <p>Prenom</p>

            <input
              className="username"
              type="text"
              name="prenom"
              value={this.state.prenom}
              onChange={this.handleChange}
            />
            <p>Nom d'utilisateur</p>

            <input
              className="username"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <p>Mot de passe</p>

            <input
              className="username"
              type="text"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="bouton">
            <button className="valider" onClick={this.handleSubmit}>
              Ajouter
            </button>
            <button className="valider" onClick={this.cancel}>
              Annuler
            </button>
          </div>
        </>
      );
    } else if (this.props.formu === "delete_driver") {
      return (
        <>
          <div className="add_driver">
            <h1>Supprimer un utilisateur</h1>

            <p>Nom Utilisateur</p>
            <input
              className="username"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </div>
          <div className="bouton">
            <button className="valider" onClick={this.handleSubmit}>
              Ajouter
            </button>
            <button className="valider" onClick={this.cancel}>
              Annuler
            </button>
          </div>
        </>
      );
    } else if (this.props.formu === "add_car") {
      return (
        <>
          <div className="add_driver">
            <h1>Ajouter une Voiture</h1>

            <p>Marque</p>
            <input
              className="username"
              type="text"
              name="Marque"
              value={this.state.Marque}
              onChange={this.handleChange}
            />
            <p>Model</p>

            <input
              className="username"
              type="text"
              name="Model"
              value={this.state.Model}
              onChange={this.handleChange}
            />
            <p>immatriculation</p>

            <input
              className="username"
              type="text"
              name="immatriculation"
              value={this.state.immatriculation}
              onChange={this.handleChange}
            />
          </div>
          <div>
            {this.state.immatriculation !== "" ? (
              <>
                <div className="qrcode" id="section-to-print">
                  <QRCode
                    className="QRC"
                    value={this.state.immatriculation}
                    size={200}
                  />
                </div>
                <button onClick={() => window.print()}>PRINT</button>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="bouton">
            <button className="valider" onClick={this.handleSubmit}>
              Ajouter
            </button>
            <button className="valider" onClick={this.cancel}>
              Annuler
            </button>
          </div>
        </>
      );
    } else if (this.props.formu === "delete_car") {
      return (
        <>
          <div className="add_driver">
            <h1>Supprimer une Voiture</h1>

            <p>Immatriculation</p>
            <input
              className="username"
              type="text"
              name="immatriculation"
              value={this.state.immatriculation}
              onChange={this.handleChange}
            />
          </div>
          <div className="bouton">
            <button className="valider" onClick={this.handleSubmit}>
              Ajouter
            </button>
            <button className="valider" onClick={this.cancel}>
              Annuler
            </button>
          </div>
        </>
      );
    } else {
      return;
    }
  };

  render() {
    return <div>{this.screenRender()}</div>;
  }
}

export default Formulaire;
