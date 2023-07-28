import React, { useEffect, useState } from "react";

import { Container } from "react-bootstrap";
import "./App.scss";
import Header from "./components/Header";
import TasksList from "./components/TasksList";

import { initializeApp } from 'firebase/app';
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
  addDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function App() {
  const [flatSchedule, setFlatSchedule] = useState();
  const [flatTasks, setFlatTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [dateString, setDateString] = useState(new Date().toUTCString());
  const [flatId, setFlatId] = useState("flat1");
  const [progressOverall, setProgressOverall] = useState(0);
  const [taskHistoryMap, setTaskHistoryMap] = useState(new Map());

  // adds or removes completed todo
  function updateCompletedTodos(taskId, todoId) {
    console.log("update Completed Todos")
    const historyIdToUpdate = taskHistoryMap.get(taskId);
    const historyRef = doc(db, "history", historyIdToUpdate);

    // returns -1 if not found
    const index = completedTodos.indexOf(todoId);

    if (index === -1) {
      // Define todo as completed
      console.log("add todo " + todoId);
      console.log(historyIdToUpdate);
      setCompletedTodos((oldState) => [...oldState, todoId]);

      // update history persitent
      updateDoc(historyRef, {
        todosCompleted: arrayUnion(todoId),
      });
    } else {
      console.log("remove todo " + todoId);
      console.log(historyIdToUpdate);
      // Define todo as not completed
      setCompletedTodos((oldState) => {
        oldState.splice(index, 1);
        return [...oldState];
      });

      // update history persitent
      updateDoc(historyRef, {
        todosCompleted: arrayRemove(todoId),
      });
    }
  }

  // Fetch flat data
  useEffect(() => {
    console.log("fetch flat data")
    onSnapshot(doc(db, "flats", flatId), (doc) => {
      const flatData = doc.data();
      console.dir(flatData);
      setFlatSchedule(flatData);
    });
  }, [flatId]);

  // Fetch tasks
  useEffect(() => {
    console.log("fetch tasks")
    if (flatSchedule) {
      const tasksRef = collection(db, "tasks");
      // getDay returns between 0 and 6, where 0 is Sunday and 6 is Saturday.
      const weekday = new Date(dateString).getDay();

      const tasksQuery = query(tasksRef, where("flat", "==", flatId));

      getDocs(tasksQuery).then((querySnapshot) => {
        setFlatTasks([]);
        if (querySnapshot.empty) {
          // no documents found
          setProgressOverall(0);
        } else {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const task = doc.data();
              task.id = doc.id;
              task.enabled = task.weekdays.includes(weekday);
              task.responsible = getResponsibleUser(
                task.responsibleFlow,
                new Date(task.startDate),
                new Date(dateString),
                task.weekdays[0]
              );
              // use function version to use the actual state
              setFlatTasks((oldState) => [...oldState, task]);
            } else {
              console.error("Unable to fetch flat data");
            }
          });
        }
      });
    }
  }, [flatSchedule, dateString]);

  // Task references
  useEffect(() => {
    console.log("fetch references")
    if (flatSchedule) {
      // reset history and todos
      setCompletedTodos((oldState) => []);
      setTodos((oldState) => []);
      setTaskHistoryMap((oldState) => new Map());
      // only fetch todos if all tasks have been fetched
      if (flatSchedule.tasks.length === flatTasks.length) {
        flatTasks.forEach((task) => {
          // fetch the todos for task
          task.todos.forEach((todoId) => {
            console.log("fetch todos");
            getDoc(doc(db, "todos", todoId)).then((todoSnap) => {
              if (todoSnap.exists()) {
                const todo = todoSnap.data();
                // use function version to use the actual state
                setTodos((oldState) => [...oldState, todo]);
              } else {
                console.error("Unable to fetch todo data");
              }
            });
          });

          // fetch history
          // this will fetch all informations about the state of the task and todo object
          if (task) {
            let createNewHistory = false;
            let oldestHistory = " ";
            if (task.history.length) {
              oldestHistory = task.history[task.history.length - 1];
            }
            console.log("fetch history");
            getDoc(doc(db, "history", oldestHistory)).then((historySnap) => {
              if (historySnap.exists()) {
                const history = historySnap.data();
                history.id = historySnap.id;
                if (isTaskHistoryCurrent(task, history)) {
                  // history is current
                  setTaskHistoryMap((oldState) => {
                    oldState.set(task.id, history.id);
                    return new Map(oldState);
                  });
                  setCompletedTodos((oldState) => [
                    ...oldState,
                    ...history.todosCompleted,
                  ]);
                } else {
                  // history isnt current
                  createNewHistory = true;
                }
              } else {
                // history doesn't exist
                createNewHistory = true;
              }
              console.log("check if have to create new: " + createNewHistory);
              if (createNewHistory) {
                // create new history
                console.log("create new history");
                addDoc(collection(db, "history"), {
                  finished: false,
                  statusUpdate: new Date().toUTCString(),
                  task: task.id,
                  todosCompleted: [],
                }).then((historyRef) => {
                  // update task
                  setTaskHistoryMap((oldState) => {
                    oldState.set(task.id, historyRef.id);
                    return new Map(oldState);
                  });

                  updateDoc(doc(db, "tasks", task.id), {
                    history: [...task.history, historyRef.id],
                  });
                });
              }
            });
          }

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

          // fetch
        });
      }
    }
  }, [flatTasks]);

  // update the progress if after fetching or updating todos
  useEffect(() => {
    console.log("update progress")
    // check to be sure that no NAN error accures
    if (todos.length >= completedTodos.length && todos.length != 0) {
      const progress = parseInt((completedTodos.length / todos.length) * 100);

      setProgressOverall(progress);
    }
  }, [completedTodos]);

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
          completedTodos={completedTodos}
          users={users}
          updateTodo={updateCompletedTodos}
          selectedDate={new Date(dateString)}
        ></TasksList>
      </Container>
    </div>
  );
}

function isTaskHistoryCurrent(task, history) {
  // Define the last start of the task
  const taskStartWeekday = task.weekdays[0]; // weekdays have to consist of at least 1 item
  const taskEndWeekday = task.weekdays[task.weekdays.length - 1];
  const lastStartWeekDate = new Date();

  // get the last starting weekday after today
  lastStartWeekDate.setDate(
    lastStartWeekDate.getDate() -
      ((lastStartWeekDate.getDay() + (7 - taskStartWeekday)) % 7)
  );

  // just focus on the weekday
  lastStartWeekDate.setHours(0, 0, 0, 0);

  // check if history is for the current task period
  if (
    !history.statusUpdate ||
    new Date(history.statusUpdate) <= lastStartWeekDate
  ) {
    return false;
  } else {
    return true;
  }
}

// gets the responsible user for the current date
function getResponsibleUser(
  userFlow,
  scheduleStartDate,
  selectedDate,
  startingWeekday
) {
  // get amount of cleaning iterations by finding out the amount of starting weekdays
  let amountCleaningIterations = getAmountOfWeekday(
    scheduleStartDate,
    selectedDate,
    startingWeekday
  );

  // if the starting date and starting weekday is not equal means that there was already a iteration before
  if (scheduleStartDate.getDate() !== startingWeekday) {
    amountCleaningIterations++;
  }
  const iterationIndex = amountCleaningIterations % userFlow.length;
  const responsibleUser = userFlow[iterationIndex - 1];
  return responsibleUser;
}

// get number of specific weekday between two dates
// weekday sun = 0, mon = 1
function getAmountOfWeekday(dateStart, dateEnd, weekday) {
  var currentDate = dateStart,
    amountWeekday = 0;
  while (currentDate <= dateEnd) {
    //count if date is the weekday
    if (currentDate.getDay() === weekday) {
      amountWeekday++;
    }
    // add one day
    // automatically rolling over to next month
    var d = new Date(currentDate.valueOf());
    d.setDate(d.getDate() + 1);
    currentDate = d;
  }
  return amountWeekday;
}
