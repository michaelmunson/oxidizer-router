# oxidizer-router
A router component & state management library for use with the [oxidizer](https://github.com/michaelmunson/oxidizer#readme) library. 

## Installation
```bash
npm install oxidizer-router
```

## Usage

```typescript
import { DIV } from "oxidizer";
import {createRouter} from "oxidizer-router";

const HomePage = () => {
    return (
        DIV('Home Page')
    )
}

const PageOne = () => {
    return (
        DIV('Page One')
    )
}

const PageTwo = () => {
    return (
        DIV('Page Two')
    )
}

const [Router, {navigate}] = createRouter({
    '/' : HomePage,
    '/page1' : PageOne,
    '/page2' : PageTwo
});

export default function App(){
    return (
        DIV({id:'app'},
            Router
        )
    )
}
```