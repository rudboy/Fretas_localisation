import React from "react";
import Geocode from "react-geocode";

class Rien extends React.Component {
  state = {
    adresse: "",
    marque: "",
    model: "",
    immat: "",
    results: ""
  };

  async componentDidMount() {
    if (this.props.loctab) {
      this.getAdresse(this.props.loctab);
    }
  }

  getAdresse = async loctab => {
    await Geocode.fromLatLng(
      loctab.localisation[0],
      loctab.localisation[1]
    ).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({ adresse: address });
        this.setState({
          results:
            this.props.loctab.cars.marque +
            " " +
            this.props.loctab.cars.modele +
            " " +
            this.props.loctab.cars.immatriculation +
            "\n" +
            this.state.adresse
        });
      },
      error => {
        console.error(error);
      }
    );
  };

  getLoc = loc => {
    return loc;
  };

  render() {
    return (
      <>
        {this.getLoc(this.props.loc)} {this.state.results}
      </>
    );
  }
}

export default Rien;
