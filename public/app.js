// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = data.length-1; i >= 0; i--) {
    // Display the apropos information on the page
    $("#articles").append("<h1><a onclick href='"+data[i].link+"'>" + data[i].title + "</a><br></h1>");
    if (data[i].summary.charAt(0)=="h" && data[i].summary.charAt(1)=="t"){
      $("#articles").append("<img src=" +data[i].summary+">")
    }else {
      $("#articles").append("<h2>"+data[i].summary+"</h2>")
    }
    $("#articles").append("<button class=viewcomments type=button data-id ='" + data[i]._id + "'>View Comments</button>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".viewcomments", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      data.notes.forEach((element, i) => {
        div = $("<div>")
        div.append("<h2>"+data.notes[i].name+"</h2>")
        div.append("<h3>"+data.notes[i].body+"</h3>")
        $("#notes").append(div)
      });      
      // An input to enter a new name
      $("#notes").append("<input id='nameinput' name='name' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' class='addcomment'>Add Comment</button>");
      
    });
});

// When you click the addcomment button
$(document).on("click", ".addcomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from name input      
          name: $("#nameinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
    }         
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      div = $("<div>")
      div.append("<h2>"+$("#nameinput").val()+"</h2>")
      div.append("<h3>"+$("#bodyinput").val()+"</h3>")
      $("#nameinput").before(div)
      $("#nameinput").val("");
      $("#bodyinput").val("");
    });

  // Also, remove the values entered in the input and textarea for note entry
 
});
