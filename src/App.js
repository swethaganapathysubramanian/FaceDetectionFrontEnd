import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceDetection from './components/FaceDetection/FaceDetection';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
//import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';



const particlesbg = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }},
      line_linked: {
      color: '#FFF',
      shadow: {
        enable: false
      }}
    }
      ,
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          }
        }
      }
    }
  
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}  

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data)=>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) =>{
      const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftcol: clarifaiface.left_col * width,
        toprow: clarifaiface.top_row * height,
        rightcol: width - (clarifaiface.right_col * width),
        bottomrow: height - (clarifaiface.bottom_row * height)
      }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
 }

  onRouteChange = (route) =>{
      if (route === 'signout'){
        this.setState(initialState);
      }
      if (route === 'home'){
        this.setState({ isSignedIn: true })
      }
      this.setState({route: route})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch(' https://salty-oasis-64250.herokuapp.com/image', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch(' https://salty-oasis-64250.herokuapp.com/image',{
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        }).then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries: count}))
        }).catch(err=> console.log(err))
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err=>console.log(err))
    
    }

    render(){
      const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <Particles className='particles' params={particlesbg} />
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
      { route === 'home' ?
        <div><Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange}
          onButtonSubmit={this.onSubmit} />
        <br></br>
        <FaceDetection imageUrl={imageUrl} box={box} /> 
      </div>
        : this.state.route === 'register'?
      <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange} /> 
          : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
      
      
      }
      </div>
  );
}
}

export default App;
