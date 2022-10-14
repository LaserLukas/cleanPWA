import React, { useEffect, useState } from "react";

import { Container } from "react-bootstrap";
import "./App.scss";
import Header from "./components/Header";
import TasksList from "./components/TasksList";
import Helper from "./util/Helper";

import db from "./firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { uid } from "uid";

export default function App() {
  const [flatSchedule, setFlatSchedule] = useState();
  const [flatTasks, setFlatTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [flatId, setFlatId] = useState("flat1");
  const [progressOverall, setProgressOverall] = useState(0);

  function updateTodo(newTodo, updateId) {
    const todoRef = doc(db, "todos", updateId);

    updateDoc(todoRef, {
      done: newTodo.done,
    });

    setTodos((oldState) => {
      console.log("update old Todo state");
      console.dir(oldState);
      const index = oldState.findIndex((oldTodo) => oldTodo.id === updateId);
      oldState[index] = newTodo;
      console.log("updated");
      console.dir(oldState);
      return [...oldState];
    });
  }

  // Fetch flat data

  useEffect(() => {
    console.log("fetch flat data");
    onSnapshot(doc(db, "flats", flatId), (doc) => {
      const flatData = doc.data();
      console.dir(flatData);
      setFlatSchedule(flatData);
    });
  }, [flatId]);

  // Fetch task data

  useEffect(() => {
    console.log("run task fetch");
    console.dir(flatSchedule);
    if (flatSchedule) {
      const tasks = [];
      flatSchedule.tasks.forEach((taskId) => {
        getDoc(doc(db, "tasks", taskId)).then((taskSnap) => {
          if (taskSnap.exists()) {
            const task = taskSnap.data();
            console.dir(task);

            // fetch responsible user
            getDoc(doc(db, "users", task.responsible)).then((userSnap) => {
              if (userSnap.exists()) {
                console.log("user fetched");
                const user = userSnap.data();
                task.responsible = user;
              } else {
                console.log("Unable to fetch user data");
              }
            });
            console.log("push the whole task");

            // use function version to use the actual state
            setFlatTasks((oldState) => [...oldState, task]);
          } else {
            console.log("Unable to fetch flat data");
          }
        });
      });

      console.log("Set all tasks");
      console.dir(tasks);
      //setFlatTasks(tasks);
      console.dir(tasks);
    }
  }, [flatSchedule]);

  useEffect(() => {
    if (flatSchedule) {
      console.log("Tasks are loaded");
      console.dir(flatTasks);

      // only fetch todos if all tasks have been fetched
      if (flatSchedule.tasks.length === flatTasks.length) {
        console.log("All tasks are fetched");

        flatTasks.forEach((task) => {
          console.log("filter todos for task: " + task.title);

          // fetch the todos
          task.todos.forEach((todo) => {
            getDoc(doc(db, "todos", todo)).then((todoSnap) => {
              if (todoSnap.exists()) {
                const todo = todoSnap.data();
                console.log("fetched todo: " + todo.title);

                // use function version to use the actual state
                setTodos((oldState) => [...oldState, todo]);
              } else {
                console.log("Unable to fetch todo data");
              }
            });
          });
        });
      }
    }
  }, [flatTasks]);

  useEffect(() => {
    console.log("updated todos");
    if (todos) {
      console.dir(todos);
      console.log("todos are now definded");
      const progress = Helper.getOverallProgress(todos);
      console.log("progress: " + progress);
      setProgressOverall(progress);
    }
  }, [todos]);

  return (
    <div>
      {flatSchedule && (
        <Header
          progressPercent={progressOverall}
          title={flatSchedule.title}
        ></Header>
      )}
      <Container className="App-container">
        <TasksList
          tasks={flatTasks}
          todos={todos}
          updateTodo={updateTodo}
        ></TasksList>
      </Container>
    </div>
  );
}
