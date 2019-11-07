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
  courses.forEach(course => {
    $(".courses").append(`<div class="courseBox card", id="${course.id}">
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
    $(el).html("Close");
    $(el).attr("onclick",`collapseBox(this, ${myCourse.data.id})`);
    if(tee.teeHexColor === "#443C30") {
      $(el).parent().find(".teeType").append(`<button class="btn btn-primary" style="background-color: ${tee.teeHexColor}">${tee.teeType}</button>`)
      console.log(tee.teeHexColor)
    }
    else if (tee.teeHexColor === "#ffffff"){
      $(el).parent().find(".teeType").append(`<button class="btn" style="background-color: ${tee.teeHexColor}; border: solid 1px;">${tee.teeType}</button>`)
      console.log(tee.teeHexColor)
    }
    else {
      $(el).parent().find(".teeType").append(`<button class="btn" style="background-color: ${tee.teeHexColor}">${tee.teeType}</button>`)
      console.log(tee.teeHexColor)
    }
  })
}

function collapseBox(el, id) {
  $(el).html("Select");
  $(el).attr("onclick", `getCourse(${id}, this)`);
  $(el).parent().find(".teeType").html("");
}
