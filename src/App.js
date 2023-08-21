import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import WebFont from 'webfontloader';



function App() {

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
  }, [])

  const [tickets, setTickets] = useState([]);
  const [groupOption, setGroupOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        const ticketsArray = data.tickets; // Extract the array of ticket objects
        setTickets(ticketsArray);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const groupedAndSortedTickets = () => {
    const groupedTickets = {};

    tickets.forEach(ticket => {
      const groupKey = groupOption === 'user' ? ticket.assignedUser : ticket.status;
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    Object.keys(groupedTickets).forEach(key => {
      groupedTickets[key].sort((a, b) => {
        if (sortOption === 'priority') {
          return b.priority - a.priority;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    });
    return groupedTickets;
  };

  useEffect(() => {
    const viewState = {
      groupOption,
      sortOption,
    };
    localStorage.setItem('kanbanViewState', JSON.stringify(viewState));
  }, [groupOption, sortOption]);

  useEffect(() => {
    const storedViewState = localStorage.getItem('kanbanViewState');
    if (storedViewState) {
      const { groupOption: storedGroupOption, sortOption: storedSortOption } = JSON.parse(storedViewState);
      setGroupOption(storedGroupOption);
      setSortOption(storedSortOption);
    }
  }, []);

  return (
    <Fragment>
      
      <div className="App">
        {/* Grouping and sorting controls */}
        <div className="controls">
          <select className='select12' value={groupOption} onChange={(e) => setGroupOption(e.target.value)}>
            <option value="status">By Status</option>
            <option value="user">By User</option>
            <option value="priority">By Priority</option>
          </select>
          <select className='select12' value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="kanban-board">
          {Object.entries(groupedAndSortedTickets()).map(([groupKey, groupTickets]) => (
            <div key={groupKey} className="group">
              <h2>{groupKey}</h2>
              {groupTickets.map(ticket => (
                <div key={ticket.id} className="card">
                  <h3>{ticket.title}</h3>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                  <p>User: {ticket.assignedUser}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    
    </Fragment>

  );
}

export default App;
