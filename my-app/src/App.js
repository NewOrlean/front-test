import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

//Публичный URL
const API_BASE_URL = "https://test-prg-production.up.railway.app/api/users";


const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", age: "", email: "" });
  const [loading, setLoading] = useState(false); // Для отображения загрузки
  const [operation, setOperation] = useState(""); // Тип операции для отображения статуса

  // Получить всех пользователей
  const fetchUsers = async () => {
    setLoading(true);
    setOperation("Получение списка пользователей...");
    try {
      const response = await axios.get(`${API_BASE_URL}/select`);
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    } finally {
      setLoading(false);
      setOperation("");
    }
  };

  // Создать пользователя
  const createUser = async () => {
    if (!newUser.name || !newUser.age || !newUser.email) {
      alert("Все поля обязательны для заполнения!");
      return;
    }
    setLoading(true);
    setOperation("Создание пользователя...");
    try {
      const response = await axios.post(`${API_BASE_URL}/insert`, newUser);
      alert(`Пользователь создан: ${response.data.email}`);
      setNewUser({ name: "", age: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
    } finally {
      setLoading(false);
      setOperation("");
    }
  };

  // Удалить пользователя
  const deleteUser = async (email) => {
    setLoading(true);
    setOperation(`Удаление пользователя с email: ${email}...`);
    try {
      await axios.delete(`${API_BASE_URL}/delete/${email}`);
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    } finally {
      setLoading(false);
      setOperation("");
    }
  };

  // Обновить пользователя
  const updateUser = async (user) => {
    setLoading(true);
    setOperation(`Обновление пользователя с email: ${user.email}...`);
    try {
      await axios.put(`${API_BASE_URL}/update`, user);
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
    } finally {
      setLoading(false);
      setOperation("");
    }
  };

  // Хэндлер для изменения полей
  const handleFieldChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  // Хэндлер сохранения изменений
  const handleSave = (index) => {
    const editedUser = { ...users[index] };

    // Проверяем, чтобы поля были валидны
    if (!editedUser.name || !editedUser.age || !editedUser.email) {
      alert("Все поля должны быть заполнены перед сохранением!");
      return;
    }

    // Приводим возраст к числу, если он был изменен через input
    editedUser.age = parseInt(editedUser.age, 10);

    updateUser(editedUser);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Список пользователей</h1>

      {loading && operation && (
        <div style={{ marginBottom: "20px", color: "blue" }}>
          <strong>{operation}</strong>
          <div className="spinner" style={{ margin: "10px auto" }}></div>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Имя"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Возраст"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={createUser} disabled={loading}>
          Создать
        </button>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Возраст</th>
            <th>Email</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.email}>
              <td>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) =>
                    handleFieldChange(index, "age", e.target.value)
                  }
                />
              </td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => deleteUser(user.email)}
                  disabled={loading}
                >
                  Удалить
                </button>
                <button
                  onClick={() => handleSave(index)}
                  disabled={loading}
                >
                  Сохранить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
