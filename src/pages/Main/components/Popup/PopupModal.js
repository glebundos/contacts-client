import Popup from 'reactjs-popup';
import s from './Popup.module.scss';
import { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../../constants';

export default function PopupModal({
  open,
  close,
  activeClient,
  jobs,
  create,
}) {
  const [name, setName] = useState(create ? '' : activeClient.name);
  const [birthDate, setBirthDate] = useState(
    create ? '' : activeClient.birthDate.slice(0, 10)
  );
  const [phone, setPhone] = useState(create ? '' : activeClient.mobilePhone);
  const [job, setJob] = useState(create ? '' : activeClient.job.id);

  const isDateValid = (date = '') => {
    if (date === '') return false;

    return true;
  };

  const isPhoneValid = (phone = '') => {
    if (
      phone.match(
        /^\+375(\s+)?\(?(17|29|25|33|44)\)?(\s+)?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/
      )
    )
      return true;
    return false;
  };

  const validateAll = () => {
    if (name.length < 4) return 'name';
    if (!isDateValid(birthDate)) return 'date';
    if (!isPhoneValid(phone)) return 'phone';
    if (job === '') return 'job';
    return 'ok';
  };

  const submitForm = async () => {
    const valid = validateAll();
    switch (valid) {
      case 'name':
        alert('Name must be at least 4 characters long');
        break;
      case 'date':
        alert('Please, choose date of birth');
        break;
      case 'phone':
        alert(
          'Incorrect phone number, possible format: \n +375(17|29|25|33|44)0000000'
        );
        break;
      case 'job':
        alert('Please, pick a job option');
        break;
      default:
        if (create) {
          const client = {
            name,
            birthDate,
            mobilePhone: phone,
            jobId: job,
          };
          await axios.post(`${apiUrl}/contacts`, client);
        } else {
          const client = {
            id: activeClient.id,
            name,
            birthDate,
            mobilePhone: phone,
            jobId: job,
          };

          await axios.put(`${apiUrl}/contacts`, client);
        }

        window.location.replace('/');
        break;
    }
  };

  const deleteContact = async () => {
    if (window.confirm('Удалить пользователя?')) {
      await axios.delete(`${apiUrl}/contacts`, {
        data: {
          id: activeClient.id,
        },
      });

      window.location.replace('/');
    }
  };
  return (
    <Popup open={open} modal closeOnDocumentClick={false} closeOnEscape={false}>
      {() => (
        <div className={s.container}>
          <div className={s.content}>
            <input
              type="text"
              name="name"
              defaultValue={activeClient.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
            ></input>
            <input
              type="date"
              name="birthDate"
              defaultValue={birthDate}
              min={'1900-01-01'}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="Дата рождения"
            ></input>
            <input
              type="text"
              name="phone"
              defaultValue={activeClient.mobilePhone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Мобильный телефон"
            ></input>
            <select
              id="jobs"
              multiple={false}
              onChange={(e) => setJob(e.target.value)}
              value={job}
            >
              <option disabled={job ? true : false} value={'DEFAULT'}>
                Выберите работу{' '}
              </option>
              {jobs ? (
                jobs.map((el, ind) => {
                  return (
                    <option key={ind} value={el.id}>
                      {el.name}
                    </option>
                  );
                })
              ) : (
                <option value="NoJob">Нет работ</option>
              )}
            </select>
          </div>
          <div className={s.buttons}>
            <button onClick={submitForm}>Подтвердить</button>
            <button onClick={close}>Закрыть</button>
            {!create && (
              <button className={s.deleteButton} onClick={deleteContact}>
                Удалить
              </button>
            )}
          </div>
        </div>
      )}
    </Popup>
  );
}
