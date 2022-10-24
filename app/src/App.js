import React, { useEffect, useState } from "react";

import { Container } from "react-bootstrap";
import "./App.scss";
import Header from "./components/Header";
import TasksList from "./components/TasksList";
import Helper from "./util/Helper";

import { db } from "./firebase";
import {
  doc,
  query,
  where,
  collection,
  getDoc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { uid } from "uid";

export default function App() {
  const [flatSchedule, setFlatSchedule] = useState();
  const [flatTasks, setFlatTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [dateString, setDateString] = useState(new Date().toUTCString());
  const [flatId, setFlatId] = useState("flat1");
  const [progressOverall, setProgressOverall] = useState(0);

  function updateTodo(newTodo, updateId) {
    const todoRef = doc(db, "todos", updateId);

    updateDoc(todoRef, {
      done: newTodo.done,
    });

    setTodos((oldState) => {
      const index = oldState.findIndex((oldTodo) => oldTodo.id === updateId);
      oldState[index] = newTodo;
      return [...oldState];
    });
  }

  // Fetch flat data
  useEffect(() => {
    onSnapshot(doc(db, "flats", flatId), (doc) => {
      const flatData = doc.data();
      console.dir(flatData);
      setFlatSchedule(flatData);
    });
  }, [flatId]);

  // Fetch tasks
  useEffect(() => {
    if (flatSchedule) {
      const tasksRef = collection(db, "tasks");
      // getDay returns between 0 and 6, where 0 is Sunday and 6 is Saturday.
      const weekday = new Date(dateString).getDay();
      console.log("weekday: ");
      console.log(weekday);

      const tasksQuery = query(
        tasksRef,
        where("flat", "==", flatId),
        where("weekdays", "array-contains", weekday)
      );

      getDocs(tasksQuery).then((querySnapshot) => {
        console.log("fetched all tasks: ");
        console.dir(querySnapshot);
        if (querySnapshot.empty) {
          // no documents found
          setFlatTasks([]);
          setProgressOverall(0);
        } else {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const task = doc.data();
              // use function version to use the actual state
              setFlatTasks((oldState) => [...oldState, task]);

              console.dir(task);
            } else {
              console.error("Unable to fetch flat data");
            }
          });
        }
      });
    }
  }, [flatSchedule, dateString]);

  useEffect(() => {
    if (flatSchedule) {
      // only fetch todos if all tasks have been fetched
      if (flatSchedule.tasks.length === flatTasks.length) {
        flatTasks.forEach((task) => {
          // fetch the todos for task
          task.todos.forEach((todo) => {
            getDoc(doc(db, "todos", todo)).then((todoSnap) => {
              if (todoSnap.exists()) {
                const todo = todoSnap.data();

                // use function version to use the actual state
                setTodos((oldState) => [...oldState, todo]);
              } else {
                console.error("Unable to fetch todo data");
              }
            });
          });

          // fetch users for task
          getDoc(doc(db, "users", task.responsible)).then((userSnap) => {
            if (userSnap.exists()) {
              const user = userSnap.data();

              // use function version to use the actual state
              setUsers((oldState) => [...oldState, user]);
            } else {
              console.error("Unable to fetch user data");
            }
          });
        });
      }
    }
  }, [flatTasks]);

  // update the progress if after fetching or updating todos
  useEffect(() => {
    if (todos) {
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
          date={dateString}
          setDate={setDateString}
        ></Header>
      )}
      <Container className="App-container">
        <TasksList
          tasks={flatTasks}
          todos={todos}
          users={users}
          updateTodo={updateTodo}
        ></TasksList>
      </Container>
    </div>
  );
}
