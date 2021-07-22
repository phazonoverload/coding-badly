// Viable Options
let vO = ['left', 'right', 'up', 'down']

exports.handler = async event => {
  try {
    const { board, you } = JSON.parse(event.body)
    const { head, body } = you

    // console.log(board.width, board.height)
    // console.log(head.x, head.y)

    // Avoid walls
    if (head.x == 0) vO = vO.filter(v => v != 'left')
    if (head.x == board.width - 1) vO = vO.filter(v => v != 'right')
    if (head.y == 0) vO = vO.filter(v => v != 'down')
    if (head.y == board.height - 1) vO = vO.filter(v => v != 'up')

    // Avoid all snakes
    for (let snake of board.snakes) {
      for (let part of snake.body.slice(0, body.length)) {
        const { x, y } = part
        if (head.x - 1 == x && head.y == y) {
          vO = vO.filter(v => v != 'left')
        }
        if (head.x + 1 == x && head.y == y) {
          vO = vO.filter(v => v != 'right')
        }
        if (head.y - 1 == y && head.x == x) {
          vO = vO.filter(v => v != 'down')
        }
        if (head.y + 1 == y && head.x == x) {
          vO = vO.filter(v => v != 'up')
        }
      }

      // Avoid other heads
      if (snake.id != you.id) {
        // Opposing Head
        const { head: oH } = snake

        // Possible Opponent Head Position Next Turn
        // We are cutting off x-1,y-1, etc. Is this overkill?
        const pohpnt = []
        for (let i = oH.x - 1; i <= oH.x + 1; i++) {
          for (let j = oH.y - 1; j <= oH.y + 1; j++) {
            pohpnt.push({ x: i, y: j })
          }
        }

        for (let part of pohpnt) {
          const { x, y } = part
          if (head.x - 1 == x && head.y == y) {
            vO = vO.filter(v => v != 'left')
          }
          if (head.x + 1 == x && head.y == y) {
            vO = vO.filter(v => v != 'right')
          }
          if (head.y - 1 == y && head.x == x) {
            vO = vO.filter(v => v != 'down')
          }
          if (head.y + 1 == y && head.x == x) {
            vO = vO.filter(v => v != 'up')
          }
        }
      }

      if (vO.length == 0) findAnyEmptySpace(board, you)
    }

    if (board.hazards) {
      // avoid if possible
      for (let hazard of board.hazards) {
        const { x, y } = hazard
        if (head.x - 1 == x && head.y == y) {
          vO = vO.filter(v => v != 'left')
        }
        if (head.x + 1 == x && head.y == y) {
          vO = vO.filter(v => v != 'right')
        }
        if (head.y - 1 == y && head.x == x) {
          vO = vO.filter(v => v != 'down')
        }
        if (head.y + 1 == y && head.x == x) {
          vO = vO.filter(v => v != 'up')
        }
      }

      // are we in a hazard square
      // collidingHazard
      let cH = board.hazards.find(hazard => hazard === head)
      if (cH) {
        // case 1: there is an easy out

        if (board.hazards.find(hazard => hazard !== { x: cH.x - 1, y: cH.y })) vO.push('left')
        if (board.hazards.find(hazard => hazard !== { x: cH.x + 1, y: cH.y })) vO.push('right')
        if (board.hazards.find(hazard => hazard !== { x: cH.y - 1, y: cH.x })) vO.push('down')
        if (board.hazards.find(hazard => hazard !== { x: cH.y + 1, y: cH.x })) vO.push('up')

        // case 2: you are in a corner
      }

      if (vO.length == 0) findAnyEmptySpace(board, you)
    }

    return res({
      move: vO[Math.floor(Math.random() * vO.length)]
    })
  } catch (error) {
    console.error(error)
    return res({ error }, 500)
  }
}

function findAnyEmptySpace(board, you) {
  const { head } = you
  for (let snake of board.snakes) {
    for (let part of snake.body.slice(0, body.length)) {
      const { x, y } = part
      if (!(head.x - 1 == x && head.y == y)) vO.push('left')
      if (!(head.x + 1 == x && head.y == y)) vO.push('right')
      if (!(head.y - 1 == y && head.x == x)) vO.push('down')
      if (!(head.y + 1 == y && head.x == x)) vO.push('up')
    }
  }

  // if(head.x-1 == )
}

function res(o, statusCode = 200) {
  return { statusCode, body: JSON.stringify(o) }
}

// '{"game":{"id":"59d0a967-613b-4699-a88d-4801c55ca727","ruleset":{"name":"solo","version":"v1.0.17"},"timeout":500},"turn":5,"board":{"height":11,"width":11,"snakes": [{"id":"gs_HXwr6CvxWHjy7RDtT6Mym6GR","name":"agitated-hoover","latency":"104","health":95,"body":[{"x":0,"y":1},{"x":1,"y":1},{"x":2,"y":1}],"head":{"x":0,"y":1},"length":3,"shout":""}],"food":[{"x":6,"y":0},{"x":5,"y":5}],"hazards":[]},"you":{"id":"gs_HXwr6CvxWHjy7RDtT6Mym6GR","name":"agitated-hoover","latency":"104","health":95,"body":[{"x":0,"y":1},{"x":1,"y":1},{"x":2,"y":1}],"head":{"x":0,"y":1},"length":3,"shout":""}}'
