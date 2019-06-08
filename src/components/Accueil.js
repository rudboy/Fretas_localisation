import React from "react";
import "../App.css";
import axios from "axios"; // const axios = require('axios');
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import Adresse from "./rien";

// variable pour afficher la map Google
const MapWithAMakredInfoWindow = compose(
  withStateHandlers(
    () => ({
      isOpen: false
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen
      })
    }
  ),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={9}
    defaultCenter={
      props.localisation
        ? { lat: props.localisation[0], lng: props.localisation[1] }
        : { lat: 48.8554969534881, lng: 2.345660787388738 }
    }
  >
    {/* si props localisation est vrai alors affiche un marker sinon affiche plusieur marker sur la map */}
    {props.localisation ? (
      <Marker
        position={
          props.localisation
            ? { lat: props.localisation[0], lng: props.localisation[1] }
            : { lat: 48.8554969534881, lng: 2.345660787388738 }
        }
        onClick={props.onToggleOpen}
      >
        {props.isOpen && (
          <InfoWindow onCloseClick={props.onToggleOpen}>
            <Adresse loc={props.adresse} />
          </InfoWindow>
        )}
      </Marker>
    ) : (
      props.tabLocalisation.map((info, index) => {
        return (
          <Marker
            key={index}
            position={{ lat: info.localisation[0], lng: info.localisation[1] }}
            onClick={props.onToggleOpen}
          >
            {props.isOpen && (
              //on click envoie info les props au composent adresse pour pouvoir afficher les infos
              <InfoWindow onCloseClick={props.onToggleOpen}>
                <Adresse loctab={info} />
              </InfoWindow>
            )}
          </Marker>
        );
      })
    )}
  </GoogleMap>
));

class Accueil extends React.Component {
  state = {
    props: "",
    tabResul: []
  };

  async componentDidMount() {
    try {
      //requette pour recupere
      const response = await axios.post(
        "https://fretas-api.herokuapp.com/trajet",
        {
          etat: "arriver",
          sort: "date-asc"
        }
      );
      let tempTab = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i] !== null) {
          tempTab.push(response.data[i]);
        }
      }
      this.setState({
        tabResul: tempTab
      });
    } catch (error) {
      this.setState({
        error: true
      });
    }
  }
  render() {
    //console.log(this.props.adresse);
    return (
      <>
        <h2>Emplacement actuel des véhicules</h2>
        <div className="carte_accueil">
          <MapWithAMakredInfoWindow
            tabLocalisation={this.state.tabResul}
            adresse={this.props.adresse}
            localisation={this.props.localisation}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB1o6dYvykmEjwLDrttX6GWu1rGZQFa-Us&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
        <p className="info">** cliquer sur les marker pour plus d'infos</p>
      </>
    );
  }
}

export default Accueil;
