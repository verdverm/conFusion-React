import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import DishDetail from './DishdetailComponent';
import Footer from './FooterComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'; 
import { connect } from 'react-redux';
import { addComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';

// these will props will now be able to connect to Main Component
// const varibale is read only and can't be assigned to something else afterwards. 
// arrow function => is used to to write concise anonymous functions.
const mapStateToProps = state => {
      return {
          dishes: state.dishes,
          comments: state.comments,
          promotions: state.promotions,
          leaders: state.leaders
      }
}

const mapDispatchToProps = (dispatch) => ({
    addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
    fetchDishes: () => {dispatch(fetchDishes())},
    resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos())
});
// A component returns a set of React elements that should appear on the screen
// Components enable you to split your UI into independent, reusable pieces
// Components also accept inputs
// Different kinds of components can be defined in React
// Each component can store its own local information in its "state"
// - Private and fully contolled by the component 
// - Can be passed as props to children
// we have lifted the state in the MainComponent.js file. It's better to store the state information here.
// the MainComponent has now become the parent component for the MenuComponent and DishdetailComponent
class Main extends Component { // this creates new component 

    constructor(props) { // in order to store the state, you need to define the state in the constructor of the class component.
        super(props); // super class is required whenever you define a class component. It's a way of passing data between
        // different components.
  }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
  }

    render() {  // any class component in react needs to implent this component 
    // called render which should return the corresponding view for this component
    // arrow functions work really well when using higher order functions like map, filter, reduce, etc. The main thing to know
    // is they take functions as arguments for processing collections of data. Whenever one function takes another function
    // as an argument, that's a good time for an arrow function.
    // the word "this." means that this varibale is only accessible within this class.  


    const HomePage = () => {
        return(
            <Home 
                dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishesErrMess={this.props.dishes.errMess}
                promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                promosLoading={this.props.promotions.isLoading}
                promosErrMess={this.props.promotions.errMess}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}
            />
        );
      }
  
      const DishWithId = ({match}) => {
        return(
            <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
              isLoading={this.props.dishes.isLoading}
              errMess={this.props.dishes.errMess}
              comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
              commentsErrMess={this.props.comments.errMess}
              addComment={this.props.addComment}
            />
        );
    };

    return (
      <div>
        <Header />
            <Switch>
                <Route path="/home" component={HomePage} />
                <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes}/>} />
                <Route path="/menu/:dishId" component={DishWithId} />
                <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders}/>} />
                <Redirect to="/home" />
            </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));