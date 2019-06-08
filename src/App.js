import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Accueil from "./components/Accueil";
import Voiture from "./components/Voiture";
import Admin from "./components/Admin";

class App extends Component {
  state = { resulta: <Accueil />, hover: "Accueil" };

  choose = name => {
    if (name === "Accueil") {
      this.setState({ hover: name });
      this.renderTabPopular();
    }
    if (name === "Voiture") {
      this.setState({ hover: name });
      this.renderTabUpcoming();
    }
    if (name === "Admin") {
      this.setState({ hover: name });
      this.renderTabTop();
    }
  };

  renderTabPopular = () => {
    this.state.resulta = <Accueil />;
    this.setState({ resulta: this.state.resulta });
  };
  renderTabUpcoming = () => {
    this.state.resulta = <Voiture />;
    this.setState({ resulta: this.state.resulta });
  };
  renderTabTop = () => {
    this.state.resulta = <Admin />;
    this.setState({ resulta: this.state.resulta });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>GESTION DES VOITURES</h1>
          <ul className="menu">
            <li
              name="Accueil"
              onClick={() => this.choose("Accueil")}
              className={this.state.hover === "Accueil" ? "active" : ""}
            >
              Accueil
            </li>

            <li
              name="Voiture"
              onClick={() => this.choose("Voiture")}
              className={this.state.hover === "Voiture" ? "active" : ""}
            >
              Trouver une Voiture
            </li>

            <li
              name="Admin"
              onClick={() => this.choose("Admin")}
              className={this.state.hover === "Admin" ? "active" : ""}
            >
              Administration
            </li>
          </ul>
        </header>
        <body>
          <section className="carte">{this.state.resulta}</section>
        </body>
      </div>
    );
  }
}

export default App;
