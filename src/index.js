const BASE_URL = "http://localhost:3000/toys"
let addToy = false;

document.addEventListener("DOMContentLoaded", init);

function init(){

  {// default code
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
    });
  }

  getToys()
  addNewToy()

}

// Get toys
function getToys() {
  fetch(BASE_URL)
  .then(r => r.json())
  .then(d => {
    d.forEach(element => {
      // make div class card for each toy and add it to toy coll
      let newDiv = document.createElement('div')
      newDiv.className = "card"
      newDiv.id = element["name"]
      document.getElementById('toy-collection').appendChild(newDiv);

      // Add h2 tag w/ toys name
      let newH2 = document.createElement('h2')
      newH2.innerHTML = element["name"]
      newDiv.appendChild(newH2)


      // Add img tag w/ src of image and class name
      let newImg = document.createElement('img')
      newImg.src = element["image"]
      newImg.className = 'toy-avatar'
      newDiv.appendChild(newImg)

      // add p tag with how many likes the toy has
      let newP = document.createElement('p')
      newP.innerText = element.likes + " Likes"
      newDiv.appendChild(newP)

      // add button with class like-btn and set id to toys id
      let newButton = document.createElement('button')
      newButton.className = 'like-btn'
      newButton.id = element.id
      newButton.innerText = "Like <3"
      newDiv.appendChild(newButton)

      // add event listener to button for Likes
      newButton.addEventListener('click', increaseToyLikes)
    })
})
}


// Add New Toy
// On event submit, add variables to the postObject, and make post request
function addNewToy() {
  document.querySelector('.add-toy-form').addEventListener('submit', event => {
    event.preventDefault();

    // make post/request Object
    let postObject = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },

      body: JSON.stringify({
        "name": event.target.children[1].value,
        "image": event.target.children[3].value,
        "likes": 0
      })
    }
    
    // Make the post request
    fetch(BASE_URL, postObject)
      .then(res => res.json())
      .then(data => {

        console.log(data)
        // remove all children in container
        document.querySelectorAll('.card').forEach(element => {
          element.remove()
        })

        // Repopulate the dom
        getToys()

      })
  })
}

// Increase a Toy's Likes
function increaseToyLikes(e) {
  // Make patch Obj
  const newLikes = +e.target.previousElementSibling.innerText.split(" ")[0]+1

  const patchObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: newLikes
    })
  }
  // Make a patch request updating number of likes
  fetch(`${BASE_URL}/${e.target.id}`, patchObj)
    .then(response => response.json())
    .then(// we need to change it in the DOM
      (data)=>{
        console.log(data)
        document.getElementById(data.name).children[2].innerText = `${newLikes} Likes`
    })
  // Toy's like count is reflected in the DOM
}