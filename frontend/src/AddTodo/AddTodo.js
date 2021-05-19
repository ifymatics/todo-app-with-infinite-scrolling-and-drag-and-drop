
import {
    Typography,
    Button,
    Icon,
    Paper,
    Box,
    TextField,
  
} from "@material-ui/core";

const AddTodo = ({
 
  setNewDueDate,
  setNewTodoText,
  newTodoText,
  newDueDate,
  addTodo,
  setError,
  classes,
  error
}) => {
    return (
        <div>
        <Paper className={classes.addTodoContainer}>
          {error &&<Typography color='error' variant='h6' >{error.message}</Typography>}
          <Box >
            <form onSubmit={addTodo}
              className={classes.todoForm} noValidate autoComplete="off">
            <Box flexGrow={1}>
         
                <TextField
                  label="Todo"
                value={newTodoText}
                onKeyPress={(event) => {
                if (event.key === "Enter" && newTodoText !=='' && newDueDate !== '') {
                  addTodo(event);
                }
              }}
                  onChange={(event) => { setNewTodoText(event.target.value);setError({})}}
                />
                <TextField label="date" type="date" value={newDueDate}
                  onChange={e => { setNewDueDate(e.target.value); setError({})}}/>
                <Button
                
                  className={classes.addTodoButton}
                  type="submit"
                startIcon={<Icon>add</Icon>}
                // onClick={() => newTodoText !== ''? addTodo(newTodoText):null}
              >
              Add
        </Button>
            
          </Box>
         
          </form>
        </Box>
      </Paper>
        </div>
    )
}

export default AddTodo
