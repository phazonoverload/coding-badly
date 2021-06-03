exports.handler = async event => {
  try {
    console.log(event)

    return res({ move: 'left' })
  } catch (error) {
    return res({ error }, 500)
  }
}

function res(o, statusCode = 200) {
  return { statusCode, body: JSON.stringify(o) }
}
