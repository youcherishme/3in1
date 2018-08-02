import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FullCalendar from 'fullcalendar-reactwrapper';

class Test extends Component {
  constructor() {
    super();
var var2 = process.env.VAR2;
console.log(var2);
var var1 = process.env.REACT_APP_BACKEND_HOST;
console.log(var1);
var var3 = process.env.REACT_APP_BACKEND_HOST3;
console.log(var3);
var var4 = process.env.REACT_APP_4;
console.log(var4);
var var5 = process.env.REACT_XXX_4;
console.log(var5);

var var6 = process.env.REACT_APPPPPP_6;
console.log(var6);
var var7 = process.env.REACT_APP_7;
console.log(var7);

var var8 = process.env.REACT_APP8;
console.log(var8);

var var9 = process.env.REACT_APP_USER_SERVICE_URL;
console.log(var9);



    this.onDayClick = this.onDayClick.bind(this);
    this.state = {
      events: [
        {
          title: 'All Day Event',
          start: '2018-06-01'
        },
        {
          title: 'Long Event',
          start: '2018-06-07',
          end: '2018-06-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-06-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-06-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-06-11',
          end: '2018-06-13'
        },
        {
          title: 'Meeting',
          start: '2018-06-12T10:30:00',
          end: '2018-06-12T12:30:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-06-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-06-28'
        }
      ],
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }
  onDayClick(date,jsEvent,view) {
    alert('tttt');
  }    

  render() {
    return (
      <div id="example-component">
        <FullCalendar
          id="mainCalendar"
          header={{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'month,basicWeek,basicDay'
          }}
          defaultDate={new Date()}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          eventLimit={true} // allow "more" link when too many events
          events={this.state.events}

          dayClick={ this.onDayClick }
        />
      </div>
    );
  }
}

Test.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

export default connect(mapStateToProps, {})(Test);
