# Web-Application
Web application that fetches data from Web API

The Web API of a WikiAds classifieds service supports publishing 
and search ads for various categories of products and services. 
The API provides access to ad categories and sub-categories as well as ads
selected category via appropriate HTTP GET requests to the server https://wikiads.onrender.com. 

I have implemented a web application that supports the following use cases:
• Navigation in categories and subcategories of advertisements
• Add ad to favorites
• View favorite ads
• Filter ads based on sub-category of ads

Architecture: the web application is based on Client-Server architecture. 
The Client is implemented as a series of HTML pages that embed JavaScript code. 
The server part is implemented as a Node.js application, which is called from the Client via hyperlinks or HTTP requests using the Fetch API.

To run the files you need to follow these steps:
1) run command node index.js , in cmd
2) open the address http://localhost:8080/ , in your web browser

(the node-modules folder was too large to upload directly to the repository , it is included in the release)
