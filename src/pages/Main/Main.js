import React, { useEffect, useState } from 'react';
import s from './Main.module.scss';
import Client from './components/Client/Client';
import PopupModal from './components/Popup/PopupModal';
import { apiUrl } from '../../constants';

export default function Store() {
  const [isLoading, setLoading] = useState(true);
  const [clients, setClients] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [activeClient, setActiveClient] = useState(null);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let res = await fetch(`${apiUrl}/contacts`);
    let response = await res.json();
    setClients(response);
    console.log(response);
    res = await fetch(`${apiUrl}/jobs`);
    response = await res.json();
    setJobs(response);
    console.log(response);
    setLoading(false);
  };

  const openUpdateModal = (client) => {
    setUpdateOpen(true);
    setActiveClient(client);
  };

  const closeUpdateModal = () => {
    setUpdateOpen(false);
    setActiveClient(null);
  };

  return (
    <div
      className={`${s.app} ${isUpdateOpen || isCreateOpen ? s.blurred : ''}`}
    >
      <header>Contacts App Inc. 2023</header>
      <div className={s.app_content}>
        <div className={s.content_header}> Список контактов</div>
        <div className={s.content}>
          {isLoading ? (
            <div className={s.loading_component}>
              <div className={s.lds_dual_ring}></div>
            </div>
          ) : (
            <div className={s.activeZone}>
              {activeClient !== null && (
                <PopupModal
                  open={isUpdateOpen}
                  close={() => closeUpdateModal()}
                  activeClient={activeClient}
                  jobs={jobs}
                  create={false}
                />
              )}
              <ul className={s.clients_list}>
                {clients
                  .map((client, index) => (
                    <li key={index}>
                      <Client client={client} openModal={openUpdateModal} />
                    </li>
                  ))
                  .sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    } else if (a.name > b.name) {
                      return 1;
                    }

                    return 0;
                  })}
              </ul>
              <button
                className={s.createButton}
                onClick={() => setCreateOpen(true)}
              >
                Создать контакт
              </button>
              {isCreateOpen && (
                <PopupModal
                  open={isCreateOpen}
                  close={() => setCreateOpen(false)}
                  activeClient={{}}
                  jobs={jobs}
                  create={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
