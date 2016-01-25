const R = require("ramda")

const lensWhere = R.curry(
  (listLens, lensPredicate, structure) => {
    const list = R.view(listLens, structure)
    for (var i = 0; i < list.length; i++) {
      var lens = lensPredicate(list[i])
      if (lens === true) {
        return R.compose(listLens, R.lensIndex(i))
      } else if (R.type(lens) === 'Function') {
        return R.compose(listLens, R.lensIndex(i), lens)
      }
    }
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
  R.lensProp('people'),
  lensWhere(R.lensProp('vices'), R.equals('pride')),
  foo
)

if (prideFromTop !== undefined) {
  console.log(R.view(prideFromTop, foo))
} else {
  console.log('not found')
}
