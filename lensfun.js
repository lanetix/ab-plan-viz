const R = require("ramda")

const findSloth = function (state) {
  for (var i = 0; i < state.people.length; i++) {
    for (var j = 0; j < state.people[i].vices.length; j++) {
      if (state.people[i].vices[j] == 'sloth') {
        return R.compose(
          R.lensProp('people'),
          R.lensIndex(i),
          R.lensProp('vices'),
          R.lensIndex(j)
        )
      }
    }
  }
}

const findSloth2 = (state) => {
  //  const lensWhere = lensWhere(state)
  return R.pipe(
    lensWhere(state, R.equals('sloth'))
  )
}

const lensWhere = R.curry(
  (structure, listLens, lensPredicate) => {
    // console.log(`lensWhere on ${JSON.stringify(structure)}`)
    const list = R.view(listLens, structure)
    // console.log(`list is ${JSON.stringify(list)}\n\n`)
    for (var i = 0; i < list.length; i++) {
      var lens = lensPredicate(list[i])
      console.log(`${JSON.stringify(list)}: list[${i}] = ${JSON.stringify(list[i])}`)
      if (lens === true) {
        console.log('predicate returned true at', i)
        return R.compose(
          listLens,
          R.lensIndex(i)
        )
      } else if (lens) {
        console.log('predicate returned lens at', i)
        return R.compose(listLens, R.lensIndex(i), lens)
      }
    }
    console.log('return undefined')
    return undefined;
  }
)

const foo = {
  people: [
    {
      name: 'Bjorn',
      vices: ['sloth', 'greed']
    },
    {
      name: 'Sven',
      vices: ['lust', 'pride']
    }
  ]
}

const prideFromTop = lensWhere(
  foo,
  R.lensProp('people'),
  (person) => {
    console.log('person for inner lW:', JSON.stringify(person))
    const prideLens = lensWhere(person, R.lensProp('vices'), R.equals('pride'))
    console.log('prideLens', prideLens)
    return prideLens
  }
)

if (prideFromTop !== undefined) {
  console.log(R.view(prideFromTop, foo))
} else {
  console.log('not found')
}

//console.log(R.view(findSloth(foo), foo))

// console.log(R.find(R.propEq('Bjorn', 'Sven'), foo.people))
/*
const sven = lensWhere(
  foo,
  R.lensProp('people'),
  R.propEq('name', 'Sven')
)

const pride = lensWhere(foo.people[1], R.lensProp('vices'), R.equals('pride'))
*/
