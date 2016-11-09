# immutable-gene

> clean your boilerplate code

Utility library that will help you clean a mess in your flux/redux reducers

````sh
    npm install --save immutable-gene
````

## Usage
## Quick start

````javascript

    import Gene from 'immutable-gene';

    state = { a: { b: {c: [{id=1, name='jon'}, {id=2, name='bob'}]}}};
    
    let result = Genen.mutate(state)
         .update('a.b.c[id=1]', {name: 'josh'})
         .push('a.b.c', {id: 3, name: 'zofia'})
         .value();
         
         
    //result: 
    //state = { a: { b: {c: [{id=1, name='josh'}, {id=2, name='bob'}, {id=3, name='zofia'}]}}};


````

## Motivation

Most of reducer code in any flux implementation looks like below:

````javascript

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        },
        ...state
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, text: action.text } :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          { ...todo, completed: !todo.completed } :
          todo
      )

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    default:
      return state
  }
}

````

its pretty messy hard to read and hard to write. And above exaple is just a simple case scenario. situation is getting better when you try to update some nested property in your state.

With usage of immutable-bene above code would look like below:

````javascript

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return Gene.push(sate, '', {
                                   id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
                                   completed: false,
                                   text: action.text
                                 });
    case DELETE_TODO:
      return Gene.remove(state, ['[id=?]', action.id]);
      
    case EDIT_TODO:
      return Gene.update(state, ['[id=?]', action.id], {text: action.text });

    case COMPLETE_TODO:
      return Gene.update(state, ['[id=?]', action.id], {completed: true });

    case COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed)
      return Gene.update(state, '', {completed: areAllMarked });

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    default:
      return state
  }
}

````


