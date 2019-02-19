import React from "react";
import { Panel, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { noteActions } from "../actions";
import { ID } from "datapeps-sdk";
import { ResourceAPI } from "datapeps-sdk";

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: props.Title,
      Content: props.Content,
      style: "info"
    };
  }

  render() {
    const { DeletedAt, ID, deleteNote } = this.props;
    const { Title, Content } = this.state;
    return (
      <Panel bsStyle={DeletedAt ? "danger" : this.state.style}>
        {DeletedAt || (
          <Button
            bsStyle={this.state.style}
            className="pull-right"
            onClick={() => deleteNote(ID)}
          >
            &times;
          </Button>
        )}
        <Panel.Heading>
          <Panel.Title componentClass="h3">{Title}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>{Content}</Panel.Body>
      </Panel>
    );
  }

  componentWillMount() {
    this.decryptNote();
  }
  async decryptNote() {
    try {
      const { datapeps } = this.props;
      const { id, data: encryptedTitle } = ID.unclip(this.state.Title);
      const resource = await new ResourceAPI(datapeps).get(id);
      const Title = resource.decrypt(encryptedTitle);
      const Content = resource.decrypt(this.state.Content);
      this.setState({ ...this.state, Title, Content, style: "warning" });
    } catch (err) {
      console.log("decryptNote: ", err);
    }
  }
}

const mapStateToProps = state => ({
  datapeps: state.authentication.datapeps
});
const mapDispatchToProps = {
  ...noteActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Note);
