# rule-engine

##### idea: 
I want to create a functional engine that provides an easy API to create rule set and makes it possible to mix and match rules together.

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
```javascript
// sync => boolean
function isAdult(user: IUser) {
    return (user.age >= 18);
}

// async => Promise<boolean> 
function isOnline(user: IUser) {
    return new Promise<boolean>((resolve, reject) => {

        setTimeout(() => {
            resolve(true); 
            // always resolve with true or false, reject is for errors!
        }, 99);

    });
}
```
#### define your rule set
all helpers return a RuleEngine-function that returns a Promise of Boolean if you run it with state.

##### call your rules like this:
```javascript
// on app start load rule 
const runRuleEngine = $if.sync(isAdult);

const currentUser:IUser = { name: 'julia', age: 28 };

// while app running
runRuleEngine(currentUser).then(result => { ... }) // => true
```
##### works with Promises, for **async** rules:
```javascript
const runRuleEngine = $if.async(isOnline), 
runRuleEngine(currentUser).then(result => { ... }) // => true

// has a timer to skip async stuff if it takes to long 
const runRuleEngine = $if.waitForOrSkip(100, isOnline), 
```
##### always & never
```javascript
const runRuleEngine = $if.always(); // or $if.never()
```
##### negation of rules
```javascript
const runRuleEngine = $when.not(
     $if.sync(isAdult),
)
```
##### deep equality on the (full) state object
```javascript
const runRuleEngine = $if.equals({ name: 'simon', age: 30 })
```
##### check if property on state has a value
```javascript
const runRuleEngine = $when.some([
        $if.has({ age: 28 }), // single prop and value
        $if.has({ name: 'peter', age: 35 }) // check for multiple  
    ]),
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
