$.getJSON("/articles", function(data) {
  for (var i = data.length-1; i >= 0; i--) {
    $("#articles").append("<h1><a onclick href='"+data[i].link+"'>" + data[i].title + "</a><br></h1>");
    if (data[i].summary.charAt(0)=="h" && data[i].summary.charAt(1)=="t"){
      $("#articles").append("<img src=" +data[i].summary+"><br>")
    }else {
      $("#articles").append("<h2>"+data[i].summary+"</h2>")
    }
    $("#articles").append("<button class=viewcomments type=button data-id ='" + data[i]._id + "'>View Comments</button>");
  }
});

$("#scrape").on("click",function(){
  $.get("/scrape").then(function(){
    location.reload();
  })
})

$(document).on("click", ".viewcomments", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      data.notes.forEach((element, i) => {
        div = $("<div class='comment'>")
        div.append("<h2>"+data.notes[i].name+"</h2>")
        div.append("<h3>"+data.notes[i].body+"</h3>")
        $("#notes").append(div)
      });      
      $("#notes").append("<input id='nameinput' name='name' placeholder='name'>");
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='comment'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' class='addcomment'>Add Comment</button>");
      
    });
});

$(document).on("click", ".addcomment", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
          name: $("#nameinput").val(),
          body: $("#bodyinput").val()
    }         
  })
    .then(function(data) {
      console.log(data);
      div = $("<div class=comment>")
      div.append("<h2>"+$("#nameinput").val()+"</h2>")
      div.append("<h3>"+$("#bodyinput").val()+"</h3>")
      $("#nameinput").before(div)
      $("#nameinput").val("");
      $("#bodyinput").val("");
    });

 
});
