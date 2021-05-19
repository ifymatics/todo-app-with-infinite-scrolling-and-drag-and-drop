import {Fragment, useRef} from 'react'
import {
    Typography,
    Paper,
  Box,
    TextField
} from "@material-ui/core";
import { Droppable} from 'react-beautiful-dnd';
import Todo from './../Todo/Todo';


const TodoList = ({
    todos,
    classes,
    hasEnded,
    loading,
    toggleTodoCompleted,
  deleteTodo,
  dateFormatter,
    container
}) => {
  const dropRef = useRef();
    return (
      <Fragment>
        <Droppable droppableId="todos" key={'idxix'}>
          {(provided) => (
            <div
            {...provided.droppableProps} ref={provided.innerRef}>
            {todos.length > 0 && (
            <Paper className={classes.todosContainer}>
              <Box display="flex" flexDirection="column" alignItems="stretch" ref={container}>
                {todos.map(({ id, text, dueDate, completed },idx) => (
                  <Todo
                    key = {id}
                    id={id}
                    idx={idx}
                    text={text}
                    dueDate={dueDate}
                   dateFormatter={dateFormatter}
                    completed={completed}
                    classes={classes}
                    deleteTodo={deleteTodo}
                    toggleTodoCompleted={toggleTodoCompleted}
                    />

                ))}
              </Box>
             
            </Paper>
             
          )}
          {loading && <Typography gutterBottom variant="body2" >...loading</Typography>}
             
           {hasEnded && <p>You're all caught up!</p>}
            {provided.placeholder}
          </div>
          )}
          </Droppable>
       </Fragment>
    )
}

export default TodoList
