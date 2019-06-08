import React from "react";
import "../App.css";
import axios from "axios"; // const axios = require('axios');

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };

  async componentDidMount() {
    try {
    } catch (error) {
      this.setState({
        error: true
      });
    }
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://fretas-api.herokuapp.com/login",
        {
          username: this.state.username,
          password: this.state.password
        }
      );
      if (response.data.token) {
        console.log("login okay");
        //mise a jour APP
        this.props.close(response.data);
      } else {
        alert(response.data);
      }
    } catch (error) {
      this.setState({
        error: true
      });
    }
  };

  render() {
    return (
      <>
        <div className="login">
          <h1>Connexion</h1>

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
            className="password"
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button className="valider" onClick={this.handleSubmit}>
            Se Connecter
          </button>
        </div>
      </>
    );
  }
}

export default Login;
