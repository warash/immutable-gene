# immutable-gene

> clean your boilerplate code inside reducers

Utility library that will help you clean mess in your flux/redux reducers.
It updates state and returns brand new object with configured modifications.

````sh
    npm install --save immutable-gene
````

## Quick start

````javascript
    import {Gene} from 'immutable-gene';

    let state:any = { a: { b: {c: [{id:1, name:'jon'}, {id:2, name:'bob'}]}}};
    let result = Gene.mutate(state)
        .update('a.b.c[id=1]', {name: 'josh'})
        .push('a.b.c', {id: 3, name: 'zofia'})
        .value();

    //result:
    //state = { a: { b: {c: [{id=1, name='josh'}, {id=2, name='bob'}, {id=3, name='zofia'}]}}};
````

````javascript
    import {Gene} from 'immutable-gene';

    let state:any ={groups: [
                        {
                          "name": "sit",
                          "users": [
                            {"id": 0, "name": "Lara Lowery"},
                            {"id": 1, "name": "Gayle Whitfield"},
                            {"id": 2, "name": "Shaw Schmidt"}]
                        },
                        {
                          "name": "ad",
                          "users": [
                            {"id": 3, "name": "Ruby Pickett"},
                            {"id": 4, "name": "Campos Flowers"},
                            {"id": 5,  "name": "Kirkland Faulkner"}
                          ]
                        }]};
    let userId = 4;
    let result = Gene.update(state, ['groups[*].users[id=?]', userId], {name: 'XYZ'})
    //it is flattening group collection and looks on each of them for user with id = 4 and updates its name to XYX
    //result:
    //              {groups: [
    //                     {
    //                       "name": "sit",
    //                       "users": [
    //                         {"id": 0, "name": "Lara Lowery"},
    //                         {"id": 1, "name": "Gayle Whitfield"},
    //                         {"id": 2, "name": "Shaw Schmidt"}]
    //                     },
    //                     {
    //                       "name": "ad",
    //                       "users": [
    //                         {"id": 3, "name": "Ruby Pickett"},
    //                         {"id": 4, "name": "XYZ"},
    //                         {"id": 5,  "name": "Kirkland Faulkner"}
    //                       ]
    //                     }]};
````


## supported methods :

- Gene.update(state, selector, object) - updates nested object found by selector like assign(i, x) from lodash
- Gene.push(state, selector, object) - adds object to nested array
- Gene.remove(state, selector) - removes object from array or from parent object
- Gene.mutate(state) - allows fluid interfacet for chainig update operations.. to get final result invoke .value() method

## slecotrs
it uses json-query npm package under the hood so it suports all selectors from this awesome packange:
https://www.npmjs.com/package/json-query


for example:

### Array filter

By default **only the first** matching item will be returned:

`people[name=Matt]`

But if you add an asterisk (`*`), **all** matching items will be returned:

`people[*country=NZ]`

You can use comparative operators:

`people[*rating>=3]`


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

It's pretty messy, hard to read and hard to write. And above exaple is just a simple case scenario. situation is getting more comlicated when you try to update some nested property in your state.

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
