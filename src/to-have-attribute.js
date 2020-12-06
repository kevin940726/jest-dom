import {checkHtmlElement, getMessage, evaluate} from './utils'

function printAttribute(stringify, name, value) {
  return value === undefined ? name : `${name}=${stringify(value)}`
}

function getAttributeComment(stringify, name, value) {
  return value === undefined
    ? `element.hasAttribute(${stringify(name)})`
    : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`
}

function evaluateToHaveAttribute(htmlElement, name, expectedValue) {
  const isExpectedValuePresent = expectedValue !== undefined
  const hasAttribute = htmlElement.hasAttribute(name)
  const receivedValue = htmlElement.getAttribute(name)

  return {isExpectedValuePresent, hasAttribute, receivedValue}
}

export function toHaveAttribute(htmlElement, name, expectedValue) {
  // checkHtmlElement(htmlElement, toHaveAttribute, this);

  return evaluate(htmlElement)(
    evaluateToHaveAttribute,
    name,
    expectedValue,
  ).then(({isExpectedValuePresent, hasAttribute, receivedValue}) => {
    return {
      pass: isExpectedValuePresent
        ? hasAttribute && this.equals(receivedValue, expectedValue)
        : hasAttribute,
      message: () => {
        const to = this.isNot ? 'not to' : 'to'
        const receivedAttribute = hasAttribute
          ? printAttribute(this.utils.stringify, name, receivedValue)
          : null
        const matcher = this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveAttribute`,
          'element',
          this.utils.printExpected(name),
          {
            secondArgument: isExpectedValuePresent
              ? this.utils.printExpected(expectedValue)
              : undefined,
            comment: getAttributeComment(
              this.utils.stringify,
              name,
              expectedValue,
            ),
          },
        )
        return getMessage(
          this,
          matcher,
          `Expected the element ${to} have attribute`,
          printAttribute(this.utils.stringify, name, expectedValue),
          'Received',
          receivedAttribute,
        )
      },
    }
  })
}
