import React from "react";
import "../App.css";
import axios from "axios"; // const axios = require('axios');
import Geocode from "react-geocode";
import Modal from "./Modal/Modal";
import Carte from "./Accueil";

Geocode.setApiKey("AIzaSyB1o6dYvykmEjwLDrttX6GWu1rGZQFa-Us");

class Voiture extends React.Component {
  state = {
    tabCar: [],
    tabMarque: [],
    tabFinalMarque: [],
    tabFinalModel: [],
    tabFinalImmat: [],
    immatriculation: "",
    tabTrajet: [],
    toto: "",
    showModal: false,
    localisation: [],
    address: ""
  };

  async componentDidMount() {
    try {
      const response = await axios.get(
        "https://fretas-api.herokuapp.com/all_cars"
      );

      // Va déclencher un nouveau render
      this.setState({
        tabCar: response.data
      });

      const doubled = this.state.tabCar.map((rateKey, index) => (
        <option key={index} value={rateKey.marque}>
          {rateKey.marque}
        </option>
      ));
      this.setState({
        tabMarque: doubled
      });

      this.setState({
        tabFinalMarque: this.marqueFunction(this.state.tabMarque)
      });
    } catch (error) {
      this.setState({
        error: true
      });
    }
  }
  openModalHandler = (localisation, address) => {
    this.setState({
      showModal: true,
      localisation: localisation,
      address: address
    });
  };

  closeModalHandler = () => {
    this.setState({
      showModal: false
    });
  };
  marqueFunction = tabMarque => {
    for (let i = 0; i < tabMarque.length; i++) {
      let temp = tabMarque[i].props.value;
      for (let x = i + 1; x < tabMarque.length; x++) {
        if (temp === tabMarque[x].props.value) {
          tabMarque.splice(x, 1);
        }
      }
    }
    return tabMarque;
  };

  handleChange = async event => {
    const name = event.target.name;
    const value = event.target.value;
    const statesToUpdate = {};
    statesToUpdate[name] = value;
    //console.log(name, value);

    if (name === "firstselect") {
      const response = await axios.post(
        "https://fretas-api.herokuapp.com/car",
        {
          marque: value
        }
      );

      const model = response.data.map((rateKey, index) => (
        <option key={index} value={rateKey.modele}>
          {rateKey.modele}
        </option>
      ));
      const defautImmat =
        "<option value='one'> Selectionner l'immatriculation </option>";

      this.setState({
        tabFinalModel: this.marqueFunction(model),
        tabFinalImmat: defautImmat,
        immatriculation: ""
      });
    }
    if (name === "secondselect") {
      const response = await axios.post(
        "https://fretas-api.herokuapp.com/car",
        {
          modele: value
        }
      );

      const immat = response.data.map((rateKey, index) => (
        <option key={index} value={rateKey.immatriculation}>
          {rateKey.immatriculation}
        </option>
      ));
      this.setState({
        tabFinalImmat: immat,
        immatriculation: value === "one" ? "" : immat[0].props.value
      });
    }
    if (name === "firthselect") {
      this.setState({ immatriculation: value });
    }
  };

  getTrajet = async immatriculation => {
    //console.log(immatriculation);
    let newTab = [];
    const response = await axios.post(
      "https://fretas-api.herokuapp.com/trajet2",
      {
        immat: immatriculation
      }
    );
    //console.log(response.data.length);
    // this.setState({ tabTrajet: response.data });
    if (response.data.length === 0) {
      alert("Aucune Info disponible pour se Véhicule");
    } else {
      for (let i = 0; i < response.data.length; i++) {
        await Geocode.fromLatLng(
          response.data[i].localisation[0],
          response.data[i].localisation[1]
        ).then(
          response => {
            const address = response.results[0].formatted_address;

            this.setState({ toto: address });
          },
          error => {
            console.error(error);
          }
        );
        newTab.push({
          adress: this.state.toto,
          cars: response.data[i].cars,
          creator:
            response.data[i].creator.nom +
            " " +
            response.data[i].creator.prenom,
          date: response.data[i].date,
          etat: response.data[i].etat,
          _id: response.data[i]._id,
          localisation: response.data[i].localisation
        });
      }
      this.setState({ tabTrajet: newTab });
    }
  };

  tableauTrajet = () => {
    if (this.state.tabTrajet.length > 0) {
      return (
        <div className="row">
          {this.state.tabTrajet.map((trajet, index) => {
            return (
              <div className="colone" key={index}>
                <div className="cover">
                  <p
                    onClick={() =>
                      this.openModalHandler(trajet.localisation, trajet.adress)
                    }
                  >
                    Voir sur la Carte
                  </p>
                </div>
                <img
                  className="image"
                  src={
                    "https://cdn-images-1.medium.com/max/1600/1*RKpCRwFy6hyVCqHcFwbCWQ.png"
                  }
                />

                <div className="info">
                  <li className="titre">{trajet.etat.toUpperCase()}</li>
                  <li className="date">Date: {trajet.date}</li>
                  <li className="conducteur">Conducteur : {trajet.creator}</li>
                  <li className="adresse">
                    Adresse de Localisation :{trajet.adress}
                  </li>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  render() {
    //console.log(this.state.tabMarque);
    return (
      <div>
        <h2>Historique des déplacements</h2>
        <div>
          {this.state.showModal ? (
            <Modal
              className="modal"
              show={this.state.showModal}
              close={this.closeModalHandler}
            >
              <Carte
                localisation={this.state.localisation}
                adresse={this.state.address}
              />
            </Modal>
          ) : null}
        </div>
        <div className="select">
          <select
            onChange={this.handleChange}
            name="firstselect"
            id="firstselect"
          >
            <option value="one"> Selectionner une marque </option>
            {this.state.tabFinalMarque}
          </select>

          <select
            onChange={this.handleChange}
            name="secondselect"
            id="secondselect"
          >
            <option value="one"> Selectionner un model </option>
            {this.state.tabFinalModel}
          </select>

          <select
            onChange={this.handleChange}
            name="firthselect"
            id="firthselect"
          >
            <option value="one"> Selectionner l'immatriculation </option>
            {this.state.tabFinalImmat}
          </select>

          <button
            className="valider"
            onClick={() => this.getTrajet(this.state.immatriculation)}
          >
            Valider
          </button>
        </div>
        <div className="contenair">{this.tableauTrajet()}</div>
      </div>
    );
  }
}

export default Voiture;
