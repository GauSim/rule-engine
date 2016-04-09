# rule-engine

##### idea: 
I want to create a functional engine that provides an easy API to create rule sets and makes it possible to mix and match rules together.

```javascript
const runRuleEngine = $when.always();
```
you can read it like this: 

> $when **state** has/is **condition** then runRuleEngine(state) returns true


> $if **state** has/is **condition** then runRuleEngine(state) returns true

```javascript
runRuleEngine(state).then(result => { ... }) // => true
```



## Quickstart


#### import rule-helpers $if and $when
define an interface of the type you want to apply rules to and create rule-helpers **$if** and **$when** by passing your interface to the RuleEngine constructor. They both supply the same functions, so you can use both **$if** <==> **$when**.
```javascript
import RuleEngine from './lib/RuleEngine';

interface IUser {
    name: string;
    age: number;
}

const { $if, $when } = new RuleEngine<IUser>();

```
#### create your own rules 
create rules by pure functions that receive **state** of your **interface** (here its a user). 
Rules should always return **Boolean** or a **Promise of Boolean**. 
All rule-helpers ($if, $when) return a RuleEngine-function that returns a Promise of Boolean if you run it with state.
```javascript

function isAdult(user: IUser) {
    return (user.age >= 18); // => Boolean
}

// on app start register your rules 
const runRuleEngine = $if.sync(isAdult);

const currentUser:IUser = { name: 'julia', age: 28 };

// call with state while app running
runRuleEngine(currentUser).then(result => { ... }) // => true

...

```
##### works with Promises, for **async** rules:
```javascript
// async 
function isOnline(user: IUser) {
    return new Promise<boolean>((resolve, reject) => {

        setTimeout(() => {
            resolve(true); // => Boolean
            // always resolve with Boolean, reject is for errors not for values!
        }, 99);

    });
}

const runRuleEngine = $if.async(isOnline), 
runRuleEngine(currentUser).then(result => { ... }) // => true

// has a timeout to skip async stuff if it takes to long 
const runRuleEngine = $if.timeout(100, isOnline), 
```
##### always & never
```javascript
const runRuleEngine = $if.always(); // or $if.never()
```
##### negation of rules
```javascript
const runRuleEngine = $if.not(
     $when.sync(isAdult),
)
```
##### deep equality on the (full) state object
```javascript
const runRuleEngine = $if.equals({ name: 'simon', age: 30 })
```
##### check if property on state has a value
```javascript
const runRuleEngine = $if.has({ age: 28 }); // single prop and value
        
const runRuleEngine = $if.has({ name: 'peter', age: 35 }) // check for multiple  

```
##### logic combine conditions with **some** or **all**. (alias: **and** & **or**)
```javascript
const runRuleEngine = $if.all([ 
    $if.sync(isAdult),
    $if.async(isOnline)
]);

// nest as deep as you like.
const runRuleEngine = $if.some([ 
    
    $if.sync(isAdult),
    $if.sync(isInstructor)
    
    
    $if.all([ 
    
        $if.some([
            $if.async(junior),
            $if.not($if.sync(isAdult))
        ]),
        
        $if.waitForOrSkip(500, isValidOnRemote)
        
    ]);
]);

```

## Want to help?
```sh
npm install
npm run watch // typescript build watch
npm run watch:serve // run/watch playground (index.ts)
npm run test:watch // run tests do TDD be cool 
```
