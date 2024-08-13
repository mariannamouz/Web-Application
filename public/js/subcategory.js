let username = null;
let password = null;
let sessionId = null;

//Find subcategoryID
let urlSearchParams = new URLSearchParams(document.location.search);
let id =urlSearchParams.get("subcategoryId");

window.addEventListener('load',function(){
    // Fetch adds from the api based on the subcategory ID
    fetch('https://wiki-ads.onrender.com/ads?subcategory='+id)
    
    // we used this to check for errors while fetching
    .then((response) => {         
        if (!response.ok) {
          console.error('Error fetching ads:', response.status, response.statusText);
        }
        return response.json();
    })

    .then((data) => {
        Handlebars.registerHelper('formatFeatures', function (features) {
            // Assuming features is a string containing feature-value pairs separated by ';'
            const featurePairs = features.split(';').filter(pair => pair.trim() !== ''); // Remove empty strings
            
            const tableRows = featurePairs.map(pair => {
                const [feature, value] = pair.split(':').map(part => part.trim());
                return `<tr><td>${feature}</td><td>${value}</td></tr>`;
            }).join('');
            
            return new Handlebars.SafeString(`<table>${tableRows}</table>`);

        });

        let template = {};

        template.templateFunction = Handlebars.compile(`    
            <div class="content-wrapper">
                <section class="ads">
                    <div class="ad-list">
                        {{#each this}}
                            <article id="articleID-{{id}}" class="ad-item">
                            
                                {{#each images}}
                                        <img src="https://wiki-ads.onrender.com/{{this}}" alt="{{../title}}">
                                {{/each}}

                                <h2 id="title{{id}}">{{title}}</h2>
                                
                                <ul>
                                    <li>Κωδικός: {{id}}</li>
                                    <li>Τιμή: {{cost}}€</li>
                                </ul>

                                <p>{{description}}</p>
                                
                                <div class="subcategory-table"> 
                                    {{formatFeatures features}}
                                </div>

                            </article>
                        {{/each}}
                    </div>
                </section>
            </div>`
        );

        let content = template.templateFunction(data);

        // append the generated content to the main element
        let main = document.getElementById("category-main");
        main.innerHTML += content;
        
    });
})