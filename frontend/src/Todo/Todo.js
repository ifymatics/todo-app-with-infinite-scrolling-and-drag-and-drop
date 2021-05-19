
import {
    Typography,
    Button,
    Icon,
    Box,
    Checkbox,
} from "@material-ui/core";
import { Draggable } from 'react-beautiful-dnd';

const Todo = ({
  id,
  idx,
  text,
  dueDate,
  completed,
  classes,
  deleteTodo,
  dateFormatter,
  toggleTodoCompleted
}) => {
  return (
    <Draggable draggableId={id} index={idx} key={id}>
    {(provided) => (
    <Box
      ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
     
      id={id}
      idx={idx}
      display="flex"
      flexDirection="row"
      alignItems="center"
      className={classes.todoContainer}
    >
      <Checkbox
        checked={completed}
        onChange={() => toggleTodoCompleted(id)}
      ></Checkbox>
      <Box flexGrow={1}>
        <Typography
          className={completed ? classes.todoTextCompleted : ""}
          variant="body1" id={id}
        >
          {text + ' '} { ': ' + dateFormatter(dueDate)}
        </Typography>
                 
      </Box>
      <Button
        className={classes.deleteTodo}
        startIcon={<Icon>delete</Icon>}
        onClick={() => deleteTodo(id)}
      >
        Delete
        </Button>
        </Box>
        )}
       </Draggable>
    )
}

export default Todo
