import React from 'react';
import { getFunName } from '../helpers';


class StorePicker extends React.Component {

    goToStore(event){
        //keep page from automatically submitting
        event.preventDefault();
        console.log("You Changed the URL");
        //first grab text from the box
        const storeId = this.storeInput.value;
        console.log(`Going to ${storeId}`);
        //second transition from / to /store:storeId
        this.context.router.transitionTo(`/store:${storeId}`)
    }

    //this is a normal JS comment
    render(){
        return (
            <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
                {/*This is a JSX comment*/}
                <h2> Please Enter A Store</h2>
                <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input)=> {this.storeInput = input}}/>
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}

StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;