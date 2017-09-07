import React from "react";

class ClickMe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMessage: false
    };
  }
  render() {
    const { showMessage } = this.state;

    console.log(this.props);

    return (
      <div>
        <div onClick={() => this.setState(() => ({ showMessage: true }))}>
          Click me!
        </div>
        {showMessage && <div>You clicked!</div>}
      </div>
    );
  }
}

export default ClickMe;
