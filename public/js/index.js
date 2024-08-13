//fetch categories and subcategories data from the web api 

fetch("https://wiki-ads.onrender.com/categories")
    .then((response) => response.json()) //parse the response as JSON
    .then((data) => {

        let template = {};
        template.templateFunction = Handlebars.compile(`        
            <!-- main content wrapper -->
            <div class="content-wrapper">
                <section id="ad-categories">
                    <h2>Κατηγορίες Αγγελιών</h2>
                    
                    <ol id="category-list">
                        {{#each this}}
                            <li>
                                <section class="ad-category">
                                    <h3>{{title}}</h3>
                                    <a href="category.html?categoryId={{id}}">
                                        <img src="https://wiki-ads.onrender.com/{{img_url}}" alt="{{title}}"/>
                                    </a>

                                    {{#if subcategories}} <!-- if this category has subcategories -->
                                        <ul>
                                            {{#each subcategories}}
                                                <li><a href="subcategory.html?subcategoryId={{id}}">{{title}}</a></li>
                                            {{/each}}
                                        </ul>
                                    {{/if}}
                                    
                                </section>
                            </li>
                        {{/each}}
                    </ol>
                </section>
            </div>        
        `);

        // Fetch subcategories for each category
        const promises = data.map(category => {
            return fetch(`https://wiki-ads.onrender.com/categories/${category.id}/subcategories`)
                .then(response => response.json())
                .then(subcategories => {
                    category.subcategories = subcategories;
                    return category;
                });
        });
            
        // wait for all subcategory fetches to complete
        Promise.all(promises)
            .then(categoriesWithSubcategories => {
                // generate HTML content using the fetched data
                let content = template.templateFunction(categoriesWithSubcategories);
                // append the generated content to the main element
                let main = document.getElementById("ad-categories-main");
                main.innerHTML += content;
        });
    });

    