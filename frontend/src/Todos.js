import { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography
} from "@material-ui/core";
import { DragDropContext } from 'react-beautiful-dnd';
import AddTodo from './AddTodo/AddTodo';
import TodoList from './TodoList/TodoList';
import DateFilter from './DateFilter/DateFilter';

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    '&::-webkit-scrollbar': {
     width: 10
    },
   
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoForm: {
    '& .MuiTextField-root': {
      margin: 5,
      width: '40ch',
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
});

const Todos = () =>{
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");

  //ALL THE NEWLY ADDED STATE VARIABLES
  const [newDueDate, setNewDueDate] = useState('');
  const [page, setPage] = useState(1);
  const [hasEnded, setHasEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const container = useRef(null);
  const [dateTag, setDateTag] = useState("All");
  const [error, setError] = useState({});
  const [currentDuedate, setCurrentDuedate] = useState("");
 
//HOOK FOR FETCHING DATA WHEN COMPONENT MOUNTS AND DURING INFINITE SCROLL AND DATE FILTERING
  useEffect(() => {
    if (!hasEnded) {
      if (dateTag === "today") {
        doFetch(currentDuedate);
       
      } else {
        doFetch();
      }
     
    }
    return () => {
      document.removeEventListener("scroll", handleScrolling);
    }
  }, [page,dateTag]);

  //HOOK FOR ADDING SCROLL EVENT LISTENER AS COMPONENT MOUNTS
  useEffect(() => {
    document.addEventListener("scroll", handleScrolling);
  }, [todos]);

//API FOR HANDLING INFINITE SCROLLING
  const handleScrolling = () => {
     if (!container.current) return
   
    if (container.current.getBoundingClientRect().bottom <= window.innerHeight) {
     
      setPage(page + 1);
      document.removeEventListener("scroll", handleScrolling);
    }
  }

//API FOR SORTING AND UPDATING TODOS DURING DRAG AND DROP
  const handleOnDragEnd = (result) => {
    if (result.source && result.destination) {
      const todoArray = [...todos];
      const [reorderedTodo] = todoArray.splice(result.source.index, 1);
      todoArray.splice(result.destination.index, 0, reorderedTodo);
      setTodos(todoArray);
    }
  }

  //API FOR FETCHING TODOS WHEN COMPONENT MOUNTS AND DURING INFINITE SCROLL
  const doFetch = (date) => {
    setLoading(false);
    fetch(`http://localhost:3001/?page=${page}&dueDate=${date}`)
      .then((response) => response.json())
      .then((todos) => {
        if (todos.length === 0) {
          setHasEnded(true);
        } else {
         
          if (dateTag === "today" && page>1 || dateTag === "All") {
            setTodos(
              (prevTodos) => [...new Set([...prevTodos, ...todos].map(todo => todo.id))]
                             .map(todoId => [...prevTodos, ...todos].find(todo => todo.id === todoId))
            );
            
          } else {
            setTodos(()=>[...todos])
          }
       
        }
       
        setLoading(false);
      }).catch(err=>alert(err.message));
  }


   //API FOR FORMATTING DATE eg 23 May 2021
  const dateFormatter = (date) => {
    let cleanedDate = '';
    if (date) {
      const month = new Date(date).toLocaleString('en-US', { month: 'long' });
      const day = new Date(date).toLocaleString('en-US', { day: '2-digit' });
      const year = new Date(date).getFullYear();
      cleanedDate = day + " " + month + "," +" "+ year;
      
    }
    return cleanedDate
  }


 //API FOR FILTERING TODOS BY DUE DATE
  const dateFilterHandler = (value) => {
    if (value === 'today') {
      const today = dateFormatter(new Date());
      setCurrentDuedate(today);
      doFetch(today);
    }
    setDateTag(value);
  }
  
  //API FOR ADDING TODOS
  const addTodo = (event) => {
    event.preventDefault()
  
    setError({});
    if (newTodoText === "" && newDueDate === "") {
     setError({message:"Please add todo and its due date"})
    } else if (newTodoText === "") {
      setError({message:"Please add todo"})
    } else if (newDueDate === "") {
      setError({message:"Please add due date"})
   }else{
    const todoForm = {
      text: newTodoText,
      dueDate: dateFormatter(newDueDate)
    }
   
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(todoForm),
    })
      .then((response) => {
        if (response.status === 201) {
         return  response.json()
         }
         return  response.text().then(text => {throw new Error(text)})
         
      })
      .then((todo) => { setTodos([...todos, todo]);})
      .catch(({message}) => setError(JSON.parse(message)))
    setNewTodoText("");
    setNewDueDate("");
  }
   
  }
 
 
  const toggleTodoCompleted = (id) => {
    setError({});
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then((response) => {
      if (response.status === 200) {
        const newTodos = [...todos];
        const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
        newTodos[modifiedTodoIndex] = {
          ...newTodos[modifiedTodoIndex],
          completed: !newTodos[modifiedTodoIndex].completed,
        };
        setTodos(newTodos);
        }else {
         return response.text().then(text => {throw new Error(text)})
        }
     
    })
      .catch(({ message }) => setError(JSON.parse(message)));
  }

  const deleteTodo = (id) => {
    setError({});
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 203) {
        setTodos(todos.filter((todo) => todo.id !== id))
        }else {
        return  response.text().then(text => {throw new Error(text)})
        }
      
    })
     .catch(({message})=>setError(JSON.parse(message)));;
  }

 

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <AddTodo
        newTodoText={newTodoText}
        newDueDate={newDueDate}
        setNewTodoText={setNewTodoText}
        setNewDueDate={setNewDueDate}
        classes={classes}
        addTodo={addTodo}
        setError={setError}
        error={error}
      />
      <DateFilter dateFilterHandler={dateFilterHandler}
        selected={dateTag}
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
      <TodoList
        deleteTodo={deleteTodo}
        todos={todos}
        classes={classes}
        loading={loading}
        hasEnded={hasEnded}
        container={container}
        deleteTodo={deleteTodo}
        dateFormatter={dateFormatter}
        toggleTodoCompleted={toggleTodoCompleted}
        />
        </DragDropContext>
    </Container>
  );
}

export default Todos;
