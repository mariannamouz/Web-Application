let username = null;
let password = null;
let sessionId = null;

let urlSearchParams = new URLSearchParams(document.location.search);
let id = urlSearchParams.get("categoryId");

function GetAdd(id,cost){    
    var title = document.getElementById("title"+id).innerHTML;
    var description = document.getElementById("description"+id).innerHTML;
    var image = document.getElementById("image"+id).src;
    var data = {id,title,cost,description,image}

    //  if the user is logged in
    if(sessionId!=null){
        const button = document.getElementById(`favorites-${id}`);
        button.disabled = true;  // Disable the button immediately upon clicking

        const options={
            method:'POST',
                
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({data,username,"sessionId" : sessionId.sessionId})
        }    
        
        fetch('http://localhost:8080/favorites',options)
        .then(response=> response.json())
        .then(data => {
            if(data == 400) {
                throw new Error("Failed To Add To favorites")
            } else {
                console.log("Added to favorites successfully");               
            }       
        })
        .catch(error => {
            alert("You need to log in first in order to add to your favorites");
            // Re-enable the button in case of an error
            button.disabled = false;
        });
    } else{ //if user is not logged in
        alert("Log in to add to favorites")
    }
}    

function getSubCategory(id) {
    let category = id.slice(id.length - 1);
    return category;
}

window.addEventListener('load',function(){
    // Fetch adds from the api based on the category ID
    fetch("https://wiki-ads.onrender.com/categories/"+id+"/ads?category={id}")
    .then((response) => response.json())
    .then((data) => {
            let template = {};

            template.templateFunction = Handlebars.compile(`
            
            <div class="content-wrapper">
                <section class="ads">
                    <div class="ad-list">
                        {{#each this}}
                            <article id="articleID-{{id}}-{{subcategory_id}}" class="ad-item">
                                <img id="image{{id}}" src="https://wiki-ads.onrender.com/{{image}}" alt="{{title}}">
                                <h2 id="title{{id}}">{{title}}</h2>
                                
                                <ul>
                                    <li>Κωδικός: {{id}}</li>
                                    <li>Τιμή: {{cost}}€</li>
                                
                                    </ul>
                                <p id= "description{{id}}">{{description}}</p>
                                
                                <div class="button-wrapper">
                                    <input class="my-button" type="button" id="favorites-{{id}}" name="favorites" value="Add to Favorites" onclick="GetAdd({{id}},{{cost}})">
                                </div>    
                            </article>
                        {{/each}}
                    </div>
                </section>
            </div>`);

            // generate HTML content using the fetched data
            let content = template.templateFunction(data);

            // append the generated content to the main element
            let main = document.getElementById("category-main");
            main.innerHTML += content;

            
        // Fetch subcategories from the api based on the category ID
        fetch("https://wiki-ads.onrender.com/categories/"+id+"/subcategories")
        .then((response) => response.json())
        .then((data) => {
            let template = {};

            template.templateFunction = Handlebars.compile(`
            <form class="login-form">
                <fieldset>

                    <label for="username"> Username 
                        <input type="text" id="username" name="username" required>
                    </label>
                            
                    <label for="password"> Password 
                        <input type="password" id="password" name="password" required>
                    </label>  

                    <div id="error"></div>  

                </fieldset>
                <div class="button-wrapper">
                    <input type="button" id="submit" name="submit" value="Sumbit">
                </div>
            </form>
                    
            <a id="view_favorites" href="#">View your favorites</a>
            

            <div class="radio-buttons">
                <input type="radio" name="subcats" id="radio-category0">
                <label for="radio-category0">All</label><br>
                {{#each this}}
                    <input type="radio" name="subcats" id="radio-category{{id}}">
                    <label for="radio-category{{id}}">{{title}}</label><br>
                {{/each}}
            </div>`);

            let content = template.templateFunction(data);

            //Aside column
            let header = document.getElementById("login-radio");
            header.innerHTML += content;

            let radioButtons = document.querySelectorAll("input[type=radio]");
            let ads = document.querySelectorAll("article.ad-item");

            radioButtons[0].checked = true;

            radioButtons[0].onclick = function() {
                // if the "All" radio button is checked, display all
                if (radioButtons[0].checked) {
                    for (let i=0; i<ads.length; i++) {
                        ads[i].style.display = "block";
                    }
                }
            };

            for (let i=1; i<radioButtons.length; i++) {
                radioButtons[i].onclick = function() {
                    // if a specific subcategory radio button is checked
                    if (radioButtons[i].checked) {
                        let subCategory = getSubCategory(radioButtons[i].id);
                        for (let j=0; j<ads.length; j++) {
                            let adsSubCategory = getSubCategory(ads[j].id);
                            if (subCategory == adsSubCategory) {
                                ads[j].style.display = "flex";
                            } else if (subCategory != adsSubCategory) {
                                ads[j].style.display = "none";
                            }
                        }
                    }
                }
            }

            document.getElementById('submit').addEventListener('click',function(){
                username = document.getElementById('username').value;
                password = document.getElementById('password').value;
                let user = {username,password}
                
                let options={
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                }

                fetch('http://localhost:8080/login',options)
                .then(response=> response.json())
                .then(data => {
                    
                    if(data==400){ // not successfull login
                        sessionId=0
                        throw new Error("Unable to login")}
                    
                    else{ // successfull login
                    
                        const erro_msg = document.getElementById("error")
                        erro_msg.innerHTML = "Successful login!"
                        sessionId = data
                        user = {username,"sessionId" : sessionId.sessionId}
                        document.getElementById("view_favorites").setAttribute("href","favorites.html?username="+username+"&sessionId="+sessionId.sessionId)
                        
                        options={
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(user)
                        }                                
                    }                
                })
                .catch(error=>{
                    const erro_msg = document.getElementById("error")
                    erro_msg.innerHTML = error
                })            
            })            
        });            
    });
}) 