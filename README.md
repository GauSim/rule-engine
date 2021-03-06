# rule-engine

[![Build Status](https://travis-ci.org/GauSim/rule-engine.svg?branch=master)](https://travis-ci.org/GauSim/rule-engine)
[![Coverage Status](https://coveralls.io/repos/github/GauSim/rule-engine/badge.svg?branch=master)](https://coveralls.io/github/GauSim/rule-engine?branch=master)

##### idea: 
I want to create a functional engine that provides an easy API to create rule sets and makes it possible to mix and match rules together.

```javascript
const runRuleEngine = $when.always();
```
you can read it like this: 

> $when **state** has/is **condition** then runRuleEngine(state) returns true


> $if **state** has/is **condition** then runRuleEngine(state) returns true

```javascript
runRuleEngine(state)
    .then(e => { 
        console.log(e.$state); // $state === state
        console.log(e.$result); // => boolean    
    });
```



## Quickstart


#### import rule-helpers $if and $when
define an interface of the type you want to apply rules to and create rule-helpers **$if** and **$when** by passing your interface to the RuleEngine constructor. They both supply the same functions, so you can use both **$if** <==> **$when**.
```javascript
import RuleEngine from 'singapur';

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

function isAdult({ age }: IUser) {
    return age >= 18; // => Boolean
}


const runRuleEngine = $if.sync(isAdult);

const currentUser:IUser = { name: 'julia', age: 16 };

runRuleEngine(currentUser)
    .then(e => { 
        console.log(e.$result); // => false
        console.log(e.$state); // => { name: 'julia', age: 16 }
    });

...

```

#### add conditionally actions with thenModify
```javascript
// action
const makeAdult = (user: IUser): IUser => (user.age = 18, user);

runRuleEngine = $if.not(runRuleEngine).thenModify(makeAdult); 
// thenModify will not have side effects $state is immutable inside the runRuleEngine

runRuleEngine(currentUser)
    .then(e => {
        console.log('from', currentUser);   // => { name: 'julia', age: 16 }
        console.log(e.$result);             // => true
        console.log('to', e.$state);        // => { name: 'julia', age: 18 }
    })
```

##### works with Promises, for **async** rules:
```javascript
// async 
function isOnline(user: IUser) {
    return new Promise<boolean>((resolve, reject) => {

        setTimeout(() => {
            resolve(true); // => Boolean
        }, 99);

        // always resolve with Boolean, reject is for errors not for values!
    
    });
}

const runRuleEngine = $if.async(isOnline), 
runRuleEngine(currentUser).then(result => { ... })

// has a timeout to skip async stuff if it takes to long 
const runRuleEngine = $if.timeout({ ms: 100, $if: isOnline }), 
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
        
        $if.timeout({ ms: 100, $if: isValidOnRemote })
        
    ]);
]);

```
##### mhm?: 
![Process](https://raw.githubusercontent.com/GauSim/rule-engine/master/process.png "Process")


## Want to help?
```sh
npm install
npm run watch // typescript build watch
npm run watch:serve // run/watch playground (index.ts)
npm run test:watch // run tests do TDD be cool 
```
