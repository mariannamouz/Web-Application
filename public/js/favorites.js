

window.addEventListener('load',function(){

    let urlSearchParams = new URLSearchParams(document.location.search);
    let username = urlSearchParams.get("username");
    let sessionId = urlSearchParams.get("sessionId");
    let customer = {username,sessionId}

    let user={"username" : customer.username,"sessionId" : customer.sessionId}
    
    let options={
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(user)
    }     
    
    fetch('http://localhost:8080/favorites_show',options)
    .then(response=>response.json())
    .then(data=>{

        if(data == 400){ // if the user hasn't logged in
            sessionId = 0
            throw new Error("You need to login first to view your favorites")
        }

        else{ // if the user has logged in

            let template = {}

            template.templateFunction=Handlebars.compile(`
                <div class="content-wrapper">
                    <section class="ads">
                        <div class="ad-list">
                            {{#each favoritesItems}}
                                <article id="articleID-{{id}}-{{subcategory_id}}" class="ad-item">
                                    <img id="image{{id}}" src="{{image}}" alt="{{title}}">                                    
                                    <h2 id="title{{id}}">{{title}}</h2>
                                    
                                    <ul>
                                        <li>Κωδικός: {{id}}</li>
                                        <li>Τιμή: {{cost}}€</li>
                                    </ul>

                                    <p>{{description}}</p>
                                            
                                </article>
                            {{/each}}

                        </div>
                    </section>
                </div>
            `)
            let content = template.templateFunction(data);
            let main = document.getElementById("category-main");
            main.innerHTML += content;
        }
    })
    .catch(error=>{
          let template = {}

        template.templateFunction=Handlebars.compile(
            ` 
            <p> {{this}} </p>
        `)
        let content = template.templateFunction(error);
        let main = document.getElementById("category-main");
        main.innerHTML += content;

    })
})

