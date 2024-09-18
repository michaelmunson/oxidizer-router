# oxidizer-router
A router component & state management library for use with the [oxidizer](https://github.com/michaelmunson/oxidizer#readme) library. 


## Installation
```bash
npm install oxidizer-router
```

## Usage
### Router
* This package provides a default export `Router` which is a function used to map routes to elements.

```typescript
import Router from "oxidizer-router";
import { DIV } from "oxidizer/intrinsics";

export default function App(){
  return (
    Router({
      '/': () => (
        DIV('Home Page')
      ),
      '/pages': {
        'index' : () => DIV('List of Pages'),
        '/1' : () => DIV('Page One')
      },
      '*': () => (
        DIV('404: Invalid URL')
      )
    })
  )
}
```
* As seen in the example above, routes can map to either a function that returns some instance of an HTMLElement, or another Routes object
### Dynamic Routes
* **Dynamic Routes** can be created by using a `:` instead of a `/` at the beginning of a route.
    * The values of these dynamic routes can be acquired via the `getParams` method.
```typescript
import Router, {getParams} from "oxidizer-router";
import { DIV } from "oxidizer/intrinsics";

const User = () => {
  const {userId} = getParams();
  return DIV('User ID: '+userId);
}

export default function App(){
  return (
    Router({
      '/': () => DIV('Home Page'),
      '/user': {
        'index' : () => DIV('List of Users'),
        ':userId' : User
      }
    })
  )
}
```
### Catch All (star) Routes
* A route which is simply a star `*` will be rendered in the event that all other routes failed to match the specified path.
```typescript
import Router, {getParams} from "oxidizer-router";
import { DIV } from "oxidizer/intrinsics";

export default function App(){
  return (
    Router({
      '/': () => DIV('Home Page'),
      '*': () => DIV('404: Not Found'),
      '/pages': {
        'index' : () => DIV('List of Pages'),
        '/1' : () => DIV('Page One'),
        '*' : () => DIV('404: Page Does Not Exist')
      },
    })
  )
}
```
* In this example, the route `/goose` will render a div with content "404: Not Found"
* The route `/pages/goose` on the other hand will render a div with content "404: Page Does Not Exist"
### Index Routes
* **Index routes** can be used when a certain path should render an element, however, it may also have child paths.
```typescript
import Router, {getParams} from "oxidizer-router";
import { DIV } from "oxidizer/intrinsics";

export default function App(){
  return (
    Router({
      '/': () => DIV('Home Page'),
      '/pages': {
        'index' : () => DIV('List of Pages'),
        '/1' : () => DIV('Page One'),
      },
    })
  )
}
```
* In this example, `/pages` will render a div with content "List of Pages"
* The route `/pages/1` on the other hand will render a div with content "Page One"
### Utility Functions
#### `navigate`
* used to update the path state. This function should be used to traverse routes.
* Beginning the desired route with a slash `/` indicates an absolute path, while not using a slash indicates a relative path.
```typescript

navigate('/pages') // path --> '/pages'
navigate('one')    // path --> '/pages/one'

/* Setting Search and Hash */
navigate('/pages/one', {search: {name:"John"}, hash:"example"})
// path --> /pages/one?name=John#example
```
#### `getParams`
* used to get the current values of dynamic routes.
#### `getSearch`
* used to get the search params for a current route.
  * returns a string,string object.
#### `getHash`
* used to get the current hash of a url
#### `getPathname`
* used to get the current pathname
#### `setSearch`
* used to set the current search parameters. Takes 1 argument, either a string,string object, or a string.
#### `setHash`
* used to set the hash

## Example
* The following example was built off an template app created with the [create-oxidizer-app](https://www.npmjs.com/package/create-oxidizer-app) package.

### 1. Create the Views
```typescript
// ./src/views/HomePage.ts

import { H1, MAIN } from "oxidizer";

export default function HomePage () {
  return (
    MAIN(
      H1('Hello World')
    )
  )
}
```
```typescript
// src/views/Users.ts

import { BR, DIV, LI, UL } from "oxidizer"

export const users = <const>{
  '10001': 'Jane Doe',
  '10002': 'John Doe',
  '10003': 'Horse Fish'
}

export default function Users() {
  return (
    DIV({ id: 'users' },
      UL(
        Object.entries(users).map(([id, name]) => (
          LI(
            `ID: ${id}`, 
            BR(),
            `Name: ${name}`
          )          
        ))
      )
    )
  )
}
```
```typescript
// src/views/User.ts

import { DIV, H1, H2, HR } from "oxidizer";
import { getParams } from "oxidizer-router";
import { users } from "./Users";

export default function User() {
  const { userId } = getParams();

  if (!(userId in users)) return (
    DIV(
      H1('User Does Not Exist :(')
    )
  )

  return (
    DIV(
      H1(`User #${userId}`),
      HR(),
      H2(`Name: ${users[userId]}`)
    )
  )
}
```
### 2. Create a Navbar
```typescript
// ./src/components/Navbar.ts
import { DIV, BUTTON, INPUT } from "oxidizer/intrinsics";
import { navigate } from "oxidizer-router";

export default function Navbar() {
  const NavInput = INPUT({
    placeholder: 'Type your Route Here' 
  });

  return (
    DIV({ id: 'navbar' },
      DIV({ style: { display: 'flex' } },
        NavInput,
        BUTTON({
          onclick: () => navigate(NavInput.value)
        }, 'Go')
      )
    )
  )
}
```
### 3. Create your App and Router
```typescript
// ./src/App.ts

import { DIV } from "oxidizer/intrinsics";
import Router from "oxidizer-router";
import HomePage from "./views/HomePage";
import Users from "./views/Users";
import User from "./views/User";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    DIV({ id: 'app' },
      Navbar(),
      Router({
        '/': HomePage,
        '/users': {
          'index': Users,
          ':userId': User,
        },
        '*': () => (
          DIV('404: Invalid URL')
        )
      })
    )
  )
}
```
### 4. Connect your App to the DOM
```typescript
// ./src/index.ts

import App from "./App";

const app = App();

document.body.append(app);
```

And you're all set!