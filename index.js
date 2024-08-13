const express = require('express')
const path = require('path')
const app = express()
const { v4: uuidv4 } = require('uuid');
app.listen(8080)

users=[{
    "username" : "Katniss",
    "password" : "123",
    "favorites" : []
},{
    "username" : "Peeta",
    "password" : "456",
    "favorites" : []
}]

app.use(express.static('public'))

// parse url-encoded content
app.use(express.urlencoded({ extended: false }))

// parse application/json content
app.use(express.json())

// index.html : content root
app.get('/', function(req, res){
    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('./public/index.html', options, function(err){
        console.log(err)
    })
})

//Login route - defines a post route 
app.post('/login', (req,res)=>{
    //extract from request body
    const username = req.body.username;
    const password = req.body.password;
    let found = false;
    var i = 0;

    while (i < users.length && !found) {
        if (username === users[i].username && password === users[i].password) {
            found = true;
        } else {
            i++;
        }
    }

    //if a matching session is found, new session
    if(found){
        const sessionId = uuidv4();
        
        res.json({"sessionId" : sessionId })
        users[i].sessionId = sessionId;
    }
    else{
        res.json(400)
    }
})

//func to fins user
function FindUser(req){
    let found = false;
    let i = 0; //iterate through users

    while (i < users.length && !found) {
        // Check both username and sessionId conditions
        if (req.body.username === users[i].username && req.body.sessionId === users[i].sessionId) {
            found = true;
        } else {
            i++;
        }
    }
    return {found,i};
}

//Add to favorites route
app.post('/favorites', (req,res)=>{
    var customer = FindUser(req)
    var i = customer.i
    let found = customer.found
    
    if(found){
        var p = 0;
        found = false

        //check if ad is already in favorites
        while(p<users[i].favorites.length && !found){
            if(users[i].favorites[p].id == req.body.dasta.id){
                found = true
                users[i].favorites[p].quantity++
            }else{
                p++
            }
        }

        //if not in faves, add it
        if(!found){
            req.body.data.quantity = 1
            users[i].favorites.push(req.body.data)
        }
        
        res.json(200)
    }
    else{
        res.json(400)
    }

})

//Show favorites route
app.post('/favorites_show',(req,res) => {
    var customer = FindUser(req)

    if(customer.found){
        res.json({"favoritesItems" : users[customer.i].favorites})
    }
    else{
        res.json(400)
    }
})

