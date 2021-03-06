import React from 'react';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import isEmail from 'validator/lib/isEmail';
import isNull from 'validator/lib/isNull';
import {browserHistory, Link} from 'react-router';
import Superagent from 'superagent';
import CircularProgress from 'material-ui/lib/circular-progress';
import Snackbar from 'material-ui/lib/snackbar';

const style = {
  marginLeft: 20,
};

let email="";
let name="";
let surname="";
let patronymic="";

let valid = false;

const RegisterDeclarantForm = React.createClass({
  getInitialState : function() {
    return {
      sending: false,
      emailErrorMessageText : "",
      nameErrorMessageText: "",
      surnameErrorMessageText: "",
    };
  },

  handleSubmit : function() {
    if (isNull(email)) {
      valid = false;
      this.setState({emailErrorMessageText:"Обязательно заполнить"});
      return;
    } else {
      valid = true;
      this.setState({emailErrorMessageText:""});
    }

    if (!isEmail(email)) {
      valid = false;
      this.setState({emailErrorMessageText:"Неверный формат почты"});
      return;
    } else {
      valid = true;
      this.setState({emailErrorMessageText:""});
    }

    if (isNull(name)) {
      valid = false;
      this.setState({nameErrorMessageText:"Обязательно заполнить"});
      return;
    } else {
      valid = true;
      this.setState({nameErrorMessageText:""});
    }

    if (isNull(surname)) {
      valid = false;
      this.setState({surnameErrorMessageText:"Обязательно заполнить"});
      return;
    } else {
      valid = true;
      this.setState({surnameErrorMessageText:""});
    }

    //Just to have ESLint shut use patronymic someway
    if (!isNull(patronymic)) {
      console.log("This is an important one, has a patronymic!  Wow.");
    }

    if (valid) {
      self = this;
      this.setState({sending:true});
      Superagent.post('/api/v1/declarant/')
        .field('email',email)
        .field('name',name)
        .field('surname',surname)
        .field('patronymic',patronymic)
        .set('Accept','application/json')
        .end(function(err, res) {
          console.log(res);
          console.log(err);
          if (res && res.body && res.body.success
            && res.body.success.idDeclarant ) {
            sessionStorage.setItem('idDeclarant', res.body.success.idDeclarant);
            browserHistory.push("/participant");
          } else {
            self.setState({open:true, error:'Ой! Ошибка.'});
          }
        });
    } else {
      console.log("Unknown error");
    }
  },

  handleEmailChange : function(event) {
    email = event.target.value;
  },

  handleNameChange : function(event) {
    name = event.target.value;
  },

  handlePatronymicChange : function(event) {
    patronymic = event.target.value;
  },

  handleSurnameChange : function(event) {
    surname = event.target.value;
  },

  handleRequestClose : function() {
    this.setState({
      open: false,
    });
  },

  render : function() {
    return (
      <div>
        <div className="col tough span_1_of_2">
          <h2>Регистрация заявителя< /h2>
          <TextField
            floatingLabelText="Электронная почта"
            errorText={this.state.emailErrorMessageText}
            onChange={this.handleEmailChange}
            style={style}
          / >
          <br / >
          <TextField
            floatingLabelText="Имя заявителя"
            errorText={this.state.nameErrorMessageText}
            onChange={this.handleNameChange}
            style={style}
          / >
          <br / >
          <TextField
            floatingLabelText="Отчество"
            errorText={this.state.patronymicErrorMessageText}
            onChange={this.handlePatronymicChange}
            style={style}
          / >
          <br / >
          <TextField
            floatingLabelText="Фамилия"
            errorText={this.state.surnameErrorMessageText}
            onChange={this.handleSurnameChange}
            style={style}
          / >
          <br / >
          <br / >
          {this.state.sending ?
            <div>
              <CircularProgress />
            </ div> :
            <FlatButton
              label="Далее"
              secondary={true}
              onMouseDown={this.handleSubmit}
              style={style}
            / >}
          {this.state.open ?
            <Snackbar
              open={this.state.open}
              message={this.state.error}
              action="Ok"
              autoHideDuration={5000}
              onRequestClose={this.handleRequestClose}
            /> : null}
        < /div>
        <div className="col tough span_2_of_2 info-block">
          Заявитель, тот кто подает заявку на участие ребенка или группы ребят в конкурсе.
          <div style={{margin:50}}>
            <a href={'https://www.youtube.com/watch?v=SYVUmVBgRBw&feature=youtu.be'} target={'_blank'} >
              Как заполнять заявку
            < /a>
            <br />
            <br />
            <Link to={`/search`}>Поиск по заявкам</Link>
          < /div>
        < /div>
      < /div>
      );
  },
});

export default RegisterDeclarantForm;
