# rule-engine

```
import RuleEngine from './lib/RuleEngine';

// playground 
interface User {
    name: string;
    age: number;
}

const { $if, $when } = new RuleEngine<User>();

function evalCustom(state: User) {
    return true;
}

function evalRemote(state: User) {
    return new Promise<boolean>((ok, fail) => {
        setTimeout(() => {
            ok(true);
        }, 99);
    });
}

// read like this: 
// [$when] state has/is condition then runRules(state) returns true;
// [$if] state has/is condition then runRules(state) returns true;

const runRules = $if.all([

    // basics like [always], [never]
    $when.always(),

    // neg
    // $when is a alias for $if ($if === $when)
    $when.not(
        $if.equals({ name: 'simon', age: 30 })
    ),

    // logic combine conditions with [some] or [all]
    // alias are for [and] & [or]
    $when.some([
        $if.always(),
        $if.never()
    ]),

    $if.equals({ name: 'julia', age: 28 }), // check for deepEqual on state object

    $if.has({ age: 28 }), // check if prop on state has value, alias is [propsAre] 

    $if.not(
        $if.has({ name: 'peter', age: 28 }) // you can check for multible values on state also
    ),

    $if.sync(evalCustom), // put your own rule in

    $if.async(evalRemote), // works with Promises, rules can be run against remote systems

    $if.waitForOrSkip(100, evalRemote), // has a timer to skip remote stuff 

]);

console.time('$timer');
console.log('start');

runRules({ name: 'julia', age: 28 })

    .then(result => {
        console.log(result);
        console.log('end');
        console.timeEnd('$timer');
    })
    .catch(e => console.error(e)); 
```
