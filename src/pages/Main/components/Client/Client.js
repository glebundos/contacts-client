import s from './Client.module.scss';

export default function Client({ client, openModal }) {
  return (
    <div className={s.client}>
      <div onClick={() => openModal(client)}>{client.name}</div>
    </div>
  );
}
