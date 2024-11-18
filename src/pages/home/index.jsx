import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/delete.svg";
import api from '../../services/api'

function Home() {
  const [users, setUsers] = useState([])
  
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

    async function getUsers(){
      const usersFromApi = await api.get('/v1/api-users/users')

      setUsers(usersFromApi.data)
      console.log(users)
    }

    async function createUsers(){
      await api.post('/v1/api-users/users', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })

      getUsers()
    }
    
    async function deleteUser(id){
      await api.delete(`/v1/api-users/users/${id}`)

      getUsers()
    }

    useEffect(() => {
      getUsers()
    }, [])

    return (
      <div className="container">
        <form>
          <h1>Cadastro de Usuários</h1>
          <input placeholder="Nome" name="nome" type="text" ref={inputName}/>
          <input placeholder="Idade" name="idade" type="number" ref={inputAge}/>
          <input placeholder="E-mail" name="email" type="email" ref={inputEmail}/>
          <button type="button" onClick={createUsers}>Cadastrar</button>
        </form>

        {users.map((user) => (
          <div key={user.id} className="card">
            <div>
              <p>Nome: <span>{user.name}</span></p>
              <p>Idade: <span>{user.age}</span></p>
              <p>Email: <span>{user.email}</span></p>
            </div>
            <button onClick={() => deleteUser(user.id)}>
              <img src={Trash} />
            </button>
          </div>
        ))}
      </div>
  );
}

export default Home;