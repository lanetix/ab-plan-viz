const R = require('ramda')

const lensWhere = R.curry(
  (listLens, lensPredicate, structure) => R.pipe(
    R.view(listLens),
    (list) => {
      for (var i = 0; i < list.length; i++) {
        let lens = lensPredicate(list[i])
        if (lens === true) {
          return R.compose(listLens, R.lensIndex(i))
        } else if (R.type(lens) === 'Function') {
          return R.compose(listLens, R.lensIndex(i), lens)
        }
      }
      return undefined
    }
  )(structure)
)

const actionEq = R.curry(
  (type, state, action) => R.propEq('type', type, action)
)

const focusedReduce = R.curry(
  (getLens, transform, state, action) => {
    const lens = getLens(action, state)
    return lens
    ? R.over(lens, transform(action), state)
    : state
  }
)

module.exports = {
  lensWhere: lensWhere,
  actionEq: actionEq,
  focusedReduce: focusedReduce
}
