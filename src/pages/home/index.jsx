import { useEffect, useState, useRef } from 'react'
import './style.css';
import Trash from '../../assets/delete.svg'
import api from '../../services/api'

function Home() {
  //estado para armazenar a lista de usuários obtidos da API
  const [users, setUsers] = useState([])
  // estado para armazenar o usuário atualmente em edição
  const [editingUser, setEditingUser] = useState(null)

  //referências para os inputs de nome, idade e email no formulário
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  //função responsável por buscar todos os usuários na API
  async function getUsers() {
    const usersFromApi = await api.get('/v1/api-users/users')
    setUsers(usersFromApi.data) //atualiza o estado com a lista de usuários
  }

  //função responsável por criar um novo usuário
  async function createUsers() {
    await api.post('/v1/api-users/users', {
      name: inputName.current.value,
      age: inputAge.current.value, 
      email: inputEmail.current.value
    })
    getUsers() //atualiza a lista de usuários após a criação
  }

  //função responsável por deletar um usuário
  async function deleteUser(id) {
    await api.delete(`/v1/api-users/users/${id}`) // Remove o usuário pelo ID
    getUsers()
  }

  //função responsável por atualizar os dados de um usuário em edição
  async function updateUser() {
    await api.put(`/v1/api-users/users/${editingUser.id}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    setEditingUser(null) //finaliza o modo de edição
    getUsers()
  }

  //fnção que prepara o formulário para edição de um usuário
  function startEditing(user) {
    setEditingUser(user) //define o usuário atual como o que será editado
    inputName.current.value = user.name
    inputAge.current.value = user.age
    inputEmail.current.value = user.email
  }

  //useEffect que carrega a lista de usuários ao montar o componente
  useEffect(() => {
    getUsers() // chama a função de buscar usuários ao iniciar
  }, [])

  return (
    <div className="container">
      <form>
        <h1>{editingUser ? "Editar Usuário" : "Cadastro de Usuários"}</h1>
      
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="E-mail" name="email" type="email" ref={inputEmail} />
        
        {/* botão para criar ou atualizar o usuário, dependendo do estado */}
        <button
          type="button"
          onClick={editingUser ? updateUser : createUsers}
        >
          {editingUser ? "Atualizar" : "Cadastrar"}
        </button>
        
        {/* botão para cancelar a edição */}
        {editingUser && (
          <button type="button" onClick={() => setEditingUser(null)}>
            Cancelar
          </button>
        )}
      </form>

      {/* renderização da lista de usuários */}
      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            {/* Exibe os dados do usuário */}
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          
          {/* botão para ativar o modo de edição do usuário */}
          <button onClick={() => startEditing(user)}>Editar</button>
          
          {/* botão para deletar o usuário */}
          <button onClick={() => deleteUser(user.id)}>
            <img src={Trash} alt="Deletar" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home
