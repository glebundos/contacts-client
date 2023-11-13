import React, { useEffect, useState } from 'react';
import './Main.css';
import Client from './Client';

export default function Store() {
  const [isLoading, setLoading] = useState(true);
  const [clients, setClients] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let res = await fetch('https://localhost:7058/api/contacts');
    let response = await res.json();
    setClients(response);
    console.log(response);
    setLoading(false);
  };

  return (
    <div className="app">
      <header>Clients App Inc. 2023</header>
      <div className="app-content">
        <div className="content-header"> Список клиентов</div>
        <div className="content">
          {isLoading ? (
            <div className="loading-component">
              <div className="lds-dual-ring"></div>
            </div>
          ) : (
            <ul className="clients-list">
              {clients.map((client, index) => (
                <li key={index}>
                  <Client
                    id={client.id}
                    name={client.name}
                    phone={client.mobilePhone}
                    birthDate={client.birthDate}
                    job={client.job}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
