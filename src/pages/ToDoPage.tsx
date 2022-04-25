import React, { useEffect, useReducer, useRef, useState } from "react";

import reducer, { initialState } from "../store/reducer";
import {
  setTodos,
  createTodo,
  toggleAllTodos,
  deleteAllTodos,
  updateTodoStatus,
} from "../store/actions";
import Service from "../service";
import { TodoStatus } from "../models/todo";

import DeleteIcon from '../images/delete.svg'

type EnhanceTodoStatus = TodoStatus | "ALL";

const ToDoPage = () => {
  const [{ todos }, dispatch] = useReducer(reducer, initialState);
  const [showing, setShowing] = useState<EnhanceTodoStatus>("ALL");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const resp = await Service.getTodos();

      dispatch(setTodos(resp || []));
    })();
  }, []);

  const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current.value.trim() !== "" && e.key === "Enter") {
      const resp = await Service.createTodo(inputRef.current.value);
      dispatch(createTodo(resp));
      inputRef.current.value = "";
    }
  };

  const onUpdateTodoStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: any
  ) => {
    dispatch(updateTodoStatus(todoId, e.target.checked));
  };

  const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleAllTodos(e.target.checked));
  };

  const onDeleteAllTodo = () => {
    dispatch(deleteAllTodos());
  };

  console.log("current todos", todos);

  return (
    <div className="Todo__page">
      <div className="Todo__creation">
        <p className="Todo__creation--text">Create a task:</p>
        <input
          ref={inputRef}
          className="Todo__input"
          placeholder="What needs to be done?"
          onKeyDown={(e) => onCreateTodo(e)}
        />
      </div>
      <div className="ToDo__container">
        <div className="Todo__toolbar">
          {todos.length >= 0 ? (
            <input type="checkbox" onChange={onToggleAllTodo} />
          ) : (
            <div />
          )}
          <div className="Todo__tabs">
            <button className="Action__btn">All</button>
            <button
              className="Action__btn"
              onClick={() => setShowing(TodoStatus.ACTIVE)}
            >
              Active
            </button>
            <button
              className="Action__btn"
              onClick={() => setShowing(TodoStatus.COMPLETED)}
            >
              Completed
            </button>
          </div>
          <button className="Action__btn" onClick={onDeleteAllTodo}>
            Clear all todos
          </button>
        </div>
        <div className="ToDo__list">
          {todos.map((todo, index) => {
            return (
              <div key={index} className="ToDo__item">
                <input
                  type="checkbox"
                  checked={showing === todo.status}
                  onChange={(e) => onUpdateTodoStatus(e, index)}
                />
                <span>{todo.content}</span>
                <button className="Todo__delete"><img src={DeleteIcon} alt="Delete todo" /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToDoPage;