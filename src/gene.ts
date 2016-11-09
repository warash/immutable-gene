import  jsonQuery from 'json-query';
import { remove, assign, cloneDeep } from 'lodash';



export class Gene {

    constructor(private state) {

    }

    subst(query, newValue) {
        this.state = Gene.subst(this.state, query, newValue);
        return this;
    }

    update(query, update) {
        this.state = Gene.update(this.state, query, update);
        return this;
    }

    remove(query) {
        this.state = Gene.remove(this.state, query);
        return this;
    }

    push(query, item) {
        this.state = Gene.push(this.state, query, item);
        return this;
    }

    value() {
        return this.state;
    }

    static mutate(state) {
        return new Gene(state);
    }

    static find(state, query) {
        return jsonQuery(query, {data: state}).value;
    }

    static remove(state, query) {
        state = cloneDeep(state);
        let curr = jsonQuery(query, {data: state}).value;
        this.findAndModify(state, curr, (parent, prop)=> {
            if (Array.isArray(parent)) {
                remove(parent, parent[prop]);
            } else {
                delete parent[prop];
            }
        });
        return state;
    }

    static subst(state, query, subst) {
        state = cloneDeep(state);
        let curr = jsonQuery(query, {data: state}).value;
        this.findAndModify(state, curr, (parent, prop)=> {
            parent[prop] = subst;
        });
        return state;
    }


    static push(state, query, item) {
        state = cloneDeep(state);
        let array = jsonQuery(query, {data: state}).value;
        if (Array.isArray(item)) {
            array.push.apply(array, item);
        } else {
            array.push(assign({}, item));
        }
        return state;
    }


    static  update(state, query, update) {
        state = cloneDeep(state);
        let toUpdate = jsonQuery(query, {data: state}).value;
        assign(toUpdate, update);
        return state;
    }


    private static findAndModify(state, value, modifier) {
        for (var x in state) {
            if (state.hasOwnProperty(x)) {
                if (state[x] == value) {
                    modifier(state, x);
                }
                if (typeof state[x] == 'object') {
                    this.findAndModify(state[x], value, modifier);
                }
            }
        }
    }
}
