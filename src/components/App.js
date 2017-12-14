import React from 'react';

import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Fish from './Fish';

import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component{

    //initial state
    state = {
        fishes: {},
        order: {}
    };

    //runs right before component is mounted(loaded)
    componentWillMount() {
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {context: this, state: 'fishes'})
        //syncState - rebase method to push info/sync state between react app and firebase takes two arguments - endpoint(name of the store) and options(object)
        //options are:
        //context = context of component(state) and
        //state = what were passing up to firebase



         //check to see if anything is in localstorage
         const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

         if(localStorageRef){
             //update <App> component order state
             this.setState({
                 order: JSON.parse(localStorageRef)
             });
         }
    }

    componentWillUnmount(){
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState){
        //this runs right before the <App /> is rendered
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }

    addFish = (fish) => {
    //update our state
        //take each fishes from existing state and put them in a new one. ... Will take every item from an object and spread into new object
        const fishes = {...this.state.fishes}

    //add in new fish
        //need to give each state item a unique key. Date.now() will give milliseconds since 1970 - so each will be unique.
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;

    //set state
        //normally you would set state as ({fishes: fishes}), but in es6 you can simply put ({fishes})
        this.setState({ fishes })
    };

    updateFish = (key, updatedFish) => {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes });

    };

    removeFish = (key) => {
        const fishes={...this.state.fishes};
        fishes[key] = null;
        this.setState({ fishes });
    };

    removeFromOrder = (key) => {
        const order={...this.state.order};
        delete order[key];
        this.setState({ order });
    };

    loadSamples = () => {
        this.setState({
            fishes: sampleFishes
        });
    };

    addToOrder = (key) => {
    //take copy of state
        const order = {...this.state.order};
    //update or add new number of fish ordered
        //if order[key] exists, it gets plus 1. else it is just 1
        order[key] = order[key] + 1 || 1;
    //update state
        this.setState({ order })
    };

    updateOrder = (key, updatedOrder ) => {
        const order = {...this.state.order};
        order[key] = updatedOrder;
        this.setState({ order });
    };




    render () {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {Object
                            .keys(this.state.fishes)
                            .map(key => <Fish
                            key={key}
                            index={key}
                            details={this.state.fishes[key]} addToOrder={this.addToOrder}/> )
                        }
                    </ul>
                </div>
                <Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.params}
                    removeFromOrder={this.removeFromOrder}
                    updateOrder={this.updateOrder}
                />
                {/*passes down the add fish method to Inventory component*/}
                <Inventory
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    addFish={this.addFish}
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                />
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;