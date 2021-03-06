import React from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Snackbar from "material-ui/Snackbar";
var dragula = require("react-dragula");
import Linkifier from "react-linkifier";
import { Scrollbars } from "react-custom-scrollbars";
import ChatStore from "app/store/ChatStore.js";
import { observer } from "mobx-react";
import UserStore from "app/store/UserStore.js";
import UIStore from "app/store/UIstore.js";
import ContentMore from "material-ui/svg-icons/navigation/expand-more";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import Dialog from "material-ui/Dialog";
var ReactDOM = require("react-dom");

let individualnotes;
const wordwrap = {
  wordWrap: "breakWord",
  overflow: "hidden",
  backgroundColor:"#DCF8C6"
};

const savebtn = {
  bottom: "1px"
};
const noteName = {
  fontSize: "0.7rem",
  left: "0",
  bottom: "15px",
  color: "#777",
  position: "absolute"
};
const pinstyle = {
  width: "22px",
  height: "22px",
  margin: "0 50px",
  display: "inline-block",
  transform: "rotate(330deg)"
};
const customContentStyle = {
  width: "30%",
  maxWidth: "none"
};
// var
const style = {
  margin: 12,
  marginRight: 20
};
@observer
class Note extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false,
      openDialog: false
    };

    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.details = this.details.bind(this);
  }

  edit() {
    this.setState({
      editing: true,
      open: false
    });
  }

  save() {
    var data = {
      newnote: this.refs.newText.value,
      _id: this.props.children._id,
      roomId: ChatStore.groupId
    };
    socket.emit("individualnote edit", data);
    this.props.children.text = data.newnote;

    this.setState({
      editing: false,
      open: false
    });
    var data = {
      user_id: UserStore.obj.user_id,
      _id: ChatStore.groupId,
      count: ChatStore.notes,
      participants: ChatStore.participants
    };
    socket.emit("readnotes edit", data);
    socket.on("Savenotes", function(data) {
      ChatStore.notes = data[0].notes;
    });
  }
  details() {
    UIStore.notedetails = true;
    ChatStore.individualnote = this.props.children;
  }
  remove() {
    var data = {
      _id: this.props.children._id,
      roomId: ChatStore.groupId
    };
    socket.emit("note delete", data);

    var data1 = {
      user_id: UserStore.obj.user_id,
      _id: ChatStore.groupId,
      count: ChatStore.notes,
      participants: ChatStore.participants
    };
    socket.emit("readnotes delete", data1);
    socket.on("remainingnotes", function(data) {
      ChatStore.notes = data[0].notes;
    });
  }

  renderDisplay() {
    if (this.props.children.from == UserStore.userrealname) {
      return (
        <div className="">
          <div
            className="note"
            style={{ backgroundColor: this.props.children.color }}
          >
            <div className="" style={{ display: "inline" }}>
              {" "}
              <img
                style={{ display: "inline-block", margin: "0 30px" }}
                src="assets/images/pin-icon.png"
                style={pinstyle}
              />
              <IconMenu
                iconButtonElement={
                  <IconButton
                    style={{
                      display: "inline",
                      float: "right",
                      width: "22px",
                      height: "22px",
                      padding: "0px"
                    }}
                    tooltip="more"
                    touch={true}
                    tooltipPosition="bottom-center"
                  >
                    <ContentMore />
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                targetOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                <MenuItem primaryText="Edit" onTouchTap={this.edit} />
                <MenuItem primaryText="Delete" onTouchTap={this.remove} />
                <MenuItem primaryText="Details" onTouchTap={this.details} />
              </IconMenu>
            </div>
            <Scrollbars
              autoHeightMax={20}
              renderTrackHorizontal={props => (
                <div
                  {...props}
                  className="track-horizontal"
                  style={{ display: "none" }}
                />
              )}
              renderThumbHorizontal={props => (
                <div
                  {...props}
                  className="thumb-horizontal"
                  style={{ display: "none" }}
                />
              )}
            >
              <p style={{ backgroundColor: this.props.children.color }}>
                <Linkifier>{this.props.children.text}</Linkifier>
              </p>
            </Scrollbars>
          </div>
        </div>
      );
    } else {
      return (
        <div className="">
          <div
            className="note"
            style={{ backgroundColor: this.props.children.color }}
          >
            <div className="" style={{ display: "inline" }}>
              {" "}
              <img
                style={{ display: "inline-block", margin: "0 30px" }}
                src="assets/images/pin-icon.png"
                style={pinstyle}
              />
              <IconMenu
                iconButtonElement={
                  <IconButton
                    style={{
                      display: "inline",
                      float: "right",
                      width: "22px",
                      height: "22px",
                      padding: "0px"
                    }}
                    tooltip="more"
                    touch={true}
                    tooltipPosition="bottom-center"
                  >
                    <ContentMore />
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                targetOrigin={{ horizontal: "left", vertical: "bottom" }}
              >
                <MenuItem primaryText="Details" onTouchTap={this.details} />
              </IconMenu>
            </div>
            <Scrollbars
              autoHeightMax={20}
              renderTrackHorizontal={props => (
                <div
                  {...props}
                  className="track-horizontal"
                  style={{ display: "none" }}
                />
              )}
              renderThumbHorizontal={props => (
                <div
                  {...props}
                  className="thumb-horizontal"
                  style={{ display: "none" }}
                />
              )}
            >
              <p style={{ backgroundColor: this.props.children.color }}>
                <Linkifier>{this.props.children.text}</Linkifier>
              </p>
              <div style={noteName}>{this.props.children.from}</div>
            </Scrollbars>
          </div>
        </div>
      );
    }
  }

  renderForm() {
    return (
      <div className="note" style={wordwrap}>
        <textarea
          ref="newText"
          maxLength="210"
          defaultValue={this.props.children.text}
          className="form-control"
          id="messagetextarea"
        />

        <button
          style={savebtn}
          onClick={this.save}
          className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk"
        />
      </div>
    );
  }
  render() {
    if (this.state.editing) {
      return this.renderForm();
    } else {
      return this.renderDisplay();
    }
  }
}

@observer
export default class Boards extends React.Component {
  constructor() {
    super();

    this.state = {
      notes: [{ text: "yo" }],
      open: false,
      openasds:false
    };

    this.update = this.update.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.eachNote = this.eachNote.bind(this);
  }

  handleTouchTap = () => {
    this.setState({
      open: true
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  update(newText, i) {
    var arr = ChatStore.notes;
    arr[i].text = newText;
    ChatStore.notes[i].text = newText;
    this.setState({
      notes: arr,
      open: false
    });
  }

  add(text) {
    var d = new Date(); // for now
    d.getHours(); // => 9
    d.getMinutes(); // =>  30
    d.getSeconds(); // => 51
    var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    var date = mm + "/" + dd + "/" + yyyy;

    var arr = ChatStore.notes;
    var data = {
      roomId: ChatStore.groupId,
      from: UserStore.userrealname,
      date: date,
      time: time,
      text: text
    };

    socket.emit("addnote", {
      roomId: ChatStore.groupId,
      from: UserStore.userrealname,
      date: date,
      time: time,
      text: text
    });
    socket.on("note messagey", function(msg) {
      if (
        chatstore.notes[chatstore.notes.length - 1].from != msg.from ||
        chatstore.notes[chatstore.notes.length - 1].text != msg.text ||
        chatstore.notes[chatstore.notes.length - 1].date != msg.date ||
        chatstore.notes[chatstore.notes.length - 1].time != msg.time
      ) {
        ChatStore.notes.push(msg);
      } else {
      }
    });
    socket.emit("recieving msgs", ChatStore.groupId);
    socket.on("remaining msgs", function(data) {
      ChatStore.notes = data[0].notes;
    });

    var data = {
      user_id: UserStore.obj.user_id,
      _id: ChatStore.groupId,
      count: ChatStore.notes,
      participants: ChatStore.participants
    };
    socket.emit("readnotes send", data);

    var e = { roomId: ChatStore.groupId };

    socket.emit("notesadding", e);
    socket.on("Note for my own", function(data) {
      ChatStore.notes = data[0].notes;
    });

    setTimeout(
      function() {
        this.setState({
          open: false
        });
      }.bind(this),
      2500
    ); //
  }
  remove(i) {
    var arr = ChatStore.notes;
    arr.splice(i, 1);
    this.setState({
      notes: arr,
      open: false
    });
  }
  eachNote(note, i) {
    this.setState({
      notes: ChatStore.notes
    });
    if (note.from == UserStore.userrealname) {
    }

    return (
      <div className="displ">
        <Note
          key={note._id}
          index={i}
          onChange={this.update}
          onRemove={this.remove}
        >
          {note.text}
        </Note>
      </div>
    );
  }
  componentDidMount() {
    var board = ReactDOM.findDOMNode(this);
    dragula([board]);
  }
  handleClose = () => {
    UIStore.notedetails = false;
  };
  render() {
    var groupSelected;
    if (ChatStore.groupname == " ") {
      groupSelected = true;
    } else false;
    var notes = ChatStore.notes;
    var b;
    return (
      <div>
        {notes.map(Users => {
          if (Users.from == UserStore.userrealname) {
            Users.color = "#DCF8C6";
            return (
              <div
                className="displ"
                key={Users._id}
                style={{ backgroundColor: Users.color }}
              >
                <Note
                  style={{ backgroundColor: Users.color }}
                  key={Users._id}
                  index={Users._id}
                  onChange={this.update}
                  onRemove={this.remove}
                >
                  {Users}
                </Note>
              </div>
            );
          } else {
            Users.color = "#FFF9C4";
            return (
              <div
                className="displ"
                key={Users._id}
                style={{ backgroundColor: Users.color }}
              >
                <Note
                  style={{ backgroundColor: Users.color }}
                  key={Users._id}
                  index={Users._id}
                  onChange={this.update}
                  onRemove={this.remove}
                >
                  {Users}
                </Note>
              </div>
            );
          }
        })}

        <div className="fixedbutton">
          {groupSelected ? (
            <div />
          ) : (
            <FloatingActionButton
              style={style}
              onTouchTap={this.handleTouchTap}
              label="yo"
              onClick={this.add.bind(null, "new note")}
            >
              <ContentAdd />
            </FloatingActionButton>
          )}

          <Dialog
            modal={false}
            overlay={false}
            onRequestClose={this.handleClose}
            contentStyle={customContentStyle}
            open={UIStore.notedetails}
          >
            <h5>Note details</h5>
            <br />
            <div className="">
              <h5>Creator : {ChatStore.individualnote.from}</h5>
              <h5>Date : {ChatStore.individualnote.date}</h5>
              <h5>Time : {ChatStore.individualnote.time}</h5>
              <h5>Note: {ChatStore.individualnote.text}</h5>
            </div>
            <br />
          </Dialog>
          <Snackbar
            open={this.state.openasds}
            message="New Note Added"
            autoHideDuration={1200}
          />
        </div>
      </div>
    );
  }
}
