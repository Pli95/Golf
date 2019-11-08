class PlayerCollection {
  constructor() {
    this.playerNames = []
  }

  add(name) {
    this.playerNames.push(new Player(name))
  }
  remove() {
    this.playerNames.pop()
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.outNum = 0;
    this.inNum = 0;
    this.totalNum = 0;
  }

}

let numPlayers = 0;
let numHoles;
let players = new PlayerCollection();

(function () {
  getCourses();
})();

function getCourses() {
  let xml = new XMLHttpRequest();
  xml.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let myCourses = JSON.parse(this.responseText);
      printCourses(myCourses.courses);
    }
  };
  xml.open('GET', 'https://golf-courses-api.herokuapp.com/courses', true);
  xml.send()
}

function printCourses(courses) {
  $(".golfCard").html(" ");
  courses.forEach(course => {
    $(".courses").append(`<div class="courseBox card" id="${course.id}">
                           <img class="card-img-top" src="${course.image}">
                           <div class="card-body">
                            <h5 class="card-title">${course.name}</h5>
                            <button onclick="getCourse(${course.id}, this)" class="btn btn-primary">Select</button>
                            <div class="teeType"></div>
                           </div>
                           </div>`)
  })
}

function getCourse(id, el) {
  let xmlCall = new XMLHttpRequest();
  xmlCall.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let myCourse = JSON.parse(this.responseText);
      printTeeType(myCourse, el)
    }
  };
  xmlCall.open('GET', `https://golf-courses-api.herokuapp.com/courses/${id}`, true)
  xmlCall.send()
}

function printTeeType(myCourse, el) {

  myCourse.data.holes[0].teeBoxes.forEach(tee => {
    console.log(myCourse.data);
    numHoles = myCourse.data.holes.length;
    $(el).html("Close");
    $(el).attr("onclick", `collapseBox(this, ${myCourse.data.id})`);
    if (tee.teeHexColor === "#443C30") {
      $(el).parent().find(".teeType").append(`<button class="btn btn-primary" style="background-color: ${tee.teeHexColor}" onclick="getCard()">${tee.teeType}</button>`)
    } else if (tee.teeHexColor === "#ffffff") {
      $(el).parent().find(".teeType").append(`<button class="btn" style="background-color: ${tee.teeHexColor}; border: solid 1px;" onclick="printCard()">${tee.teeType}</button>`)
    } else {
      $(el).parent().find(".teeType").append(`<button class="btn" style="background-color: ${tee.teeHexColor}" onclick="printCard()">${tee.teeType}</button>`)
    }
  })
}

function collapseBox(el, id) {
  $(el).html("Select");
  $(el).attr("onclick", `getCourse(${id}, this)`);
  $(el).parent().find(".teeType").html("");
}

function getCard(tee) {
  let teeObject = JSON.parse(tee);
  console.log(teeObject)
}

function printCard() {
  $(".courses").html(" ");
  $(".courses").attr("style", "min-height: 0");
  $(".golfCard").append(`<div class="buttons">
                            <button class="btn btn-primary" onclick="getCourses()">Back</button>
                            <div class="playersButtons">
                                <span>Players</span>
                                <button class="btn addRemove" data-toggle="modal" data-target="#addPlayerModal"><i class="fas fa-plus-circle"></i></button>
                                <button class="btn addRemove" onclick="removePlayers()"><i class="fas fa-minus-circle"></i></button>
                            </div> 
                         </div>
                         <div class="box"></div>`);
  $(".box").append(`<div class="label column">
                        <div class="name">HOLE</div>
                    </div>`);
  buildCol()
}

function buildCol() {
  for (let i = 1; i <= numHoles; i++) {
    if (i === numHoles / 2 + 1) {
      $(".box").append(`<div id="out" class="column">OUT</div>`)
    }
    $(".box").append(`<div id="hole${i}" class="column">${i}</div>`)
  }
  $(".box").append(`<div id="in" class="column">IN</div>
                    <div id="total" class="column">TOT</div>`)
}

function buildRow() {
  for (let j = 1; j <= numHoles; j++) {
    $("#hole" + j).append(`<input type = number pattern="\\d*" id="player${numPlayers}${j}" class="players" onblur="doMath(this)"></input>`)
  }
  $("#out").append(`<div class="players" id="out${numPlayers}">${players.playerNames[0].outNum}</div>`)
  $("#in").append(`<div class="players" id="in${numPlayers}">0</div>`)
  $("#total").append(`<div class="players" id="total${numPlayers}">0</div>`)
}

function removeRow() {
  for (let j = 1; j <= numHoles; j++) {
    $("#hole" + j).children("input:last").remove()
  }
  $("#out").children("div:last").remove();
  $("#in").children("div:last").remove();
  $("#total").children("div:last").remove()
}

function addPlayers(playerName) {
  for (let p = 0; p < players.playerNames.length; p++) {
    if (playerName.trim() === players.playerNames[p].name) {
      $("#validation").html("Oops! Looks like you entered two of the same names")
      $("#validation").css("color", "red");
      return false
    }
  }
  players.add(playerName.trim());
  numPlayers++;
  $(".name").append(` <div class="players">${playerName.trim()}</div>`);
  buildRow();
  $("#playerName").val(" ")
  $("#validation").html("Player added");
  $("#validation").css("color", "green");
}

function removePlayers() {
  numPlayers--;
  players.remove();
  $(".name").children("div:last").remove();
  removeRow();
}

function doMath(el) {
  let num = parseInt(el.value);
  if (!num) {
    num = 0;
  }


  for (let i = 1; i <= numPlayers; i++) {
    let player = players.playerNames[i-1]
    if (el.id.indexOf(i) === 6) {
      if (!el.id.charAt(8)) {
        player.outNum += num;
        $(`#out${i}`).html(player.outNum);
        // }
      }
      else {
        player.inNum += num;
        $(`#in${i}`).html(player.inNum);
      }
      player.totalNum = player.outNum + player.inNum;
      $(`#total${i}`).html(player.totalNum);
    }
  }

}
