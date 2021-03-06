import RuleEngine from './index';

// define a interface you want to apply rules to
interface IUser {
    name: string;
    age: number;
}
const { $if, $when } = new RuleEngine<IUser>();


function isAdult({ age }: IUser) {
    return age >= 18;
}

function isOnline(user: IUser) {
    return new Promise((resolve) => {

        console.log(user);

        // call async remote api to eval
        setTimeout(() => {
            resolve(true); // allways resolve with true or false, reject is for errors
        }, 99);

    });
}

// Define your RuleSet
// read like this: 
// [$when] state has/is condition then runRules(state) returns true;
// [$if] state has/is condition then runRules(state) returns true;



const runRuleEngine = $if.all([

    // basics like [always], [never]
    $when.always(),

    // neg
    // $when is a alias for $if ($if === $when)
    $when.not(
        $if.equals({ name: 'simon', age: 30 })
    ),

    $if.equals({ name: 'simon', age: 30 }),


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

    $if.sync(isAdult), // put your own rule in

    $if.async(isOnline), // works with Promises, rules can be run against remote systems

    $if.timeout({ ms: 100, $if: isOnline }), // has a timer to skip remote stuff 

]);


const currentUser: IUser = { name: 'julia', age: 28 };

// process1 => running the runRuleEngine with some state
runRuleEngine(currentUser)
    .then(result => {

        console.log('form', currentUser);
        console.log('to', result.$state); // => currentUser
        console.log(result.$result); // => false

    })
    .catch(e => console.error(e));



const makeAdult = (currentUser: IUser): IUser => (currentUser.age = 18, currentUser);

const runRuleEngineINVERT = $if.not(runRuleEngine).thenModify(makeAdult); // thenModify will not have side effects 

runRuleEngineINVERT(currentUser)
    .then(result => {

        console.log('from', currentUser);
        console.log('to', result.$state); // => currentUser
        console.log(result.$result); // => false

    })
    .catch(e => console.error(e));
