hey chatgpt i have created a backend file where i initalise npm and install these packages : {
  "name": "backend",
  "version": "1.0.0",
  "description": "book review platform",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/index.js"
  },
  "author": "mayur pal",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cloudinary": "^2.7.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.16.0",
    "multer": "^2.0.1",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}

and i have create file system for each directory. i have parent direcotry name backend inside it i am writing code of backend .

filesystem of root(backend) directory: 
drwxrwxr-x   4 mayur mayur  4096 Jun 19 20:26 .
drwxrwxr-x   5 mayur mayur  4096 Jun 19 20:11 ..
drwxrwxr-x 148 mayur mayur 12288 Jun 19 20:44 node_modules
-rw-rw-r--   1 mayur mayur   623 Jun 19 20:44 package.json
-rw-rw-f--   1 mayur mayur 64685 Jun 19 20:44 package-lock.json
drwxrwxr-x   8 mayur mayur  4096 Jun 19 20:28 src

file-system of src directory:
-rw-rw-r-- 1 mayur mayur    0 Jun 19 20:28 app.js
-rw-rw-r-- 1 mayur mayur    0 Jun 19 20:28 config.js
-rw-rw-r-- 1 mayur mayur    0 Jun 19 20:28 constant.js
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:35 controllers
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:32 database
-rw-rw-r-- 1 mayur mayur    0 Jun 19 20:28 index.js
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:27 middlewares
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:27 model
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:33 routes
drwxrwxr-x 2 mayur mayur 4096 Jun 19 20:42 utils

filesystem of database directory is index.js -> where i have to write database connection code so that i follow sepereate code of concern

filesystem of controllers primiarly has 2 files. : books.controller.js  user.controller.js ;
in books.controller.js i have to write controller(real world function to manipulate books api) similarly for user.controller.js file i have to write controllers releated to user like forget-password, change-email so on;

filesystem for middleware -> initally as seting up the project i am not deciding to add any file but maybe we can add multer.js for taking image from user

filesystem for models-> here we have write mongoose data modelling. here we have 2 files name: user.model.js -> defined model for user; similarly we have book.model.js-> gere we defined database schema of books

filesystem for routes: here we have integreated api endpoint with speccific controllers . similarly we have 2 files one for user.routes.js and other book.route.js 

file-system for utilis -> here we re defining function which user frequently so that we have to import these function from here. 
intially we are defining 3 files which has sepereate code of concern for instance . apiError.js  apiResponse.js  asynchHandler.js
apiError is a class where we have to pass contructor so that we dont have to need pass ApiError in traditional express format repeateditly we have to pass just new ApiError(400,"Error msg") something like that. similarly process for apiResponse.js file: new ApiResponse(200,data ,"succesfull message", successCode) 
asynchandler.utils.js--> By default, Express does not catch errors thrown in asynchronous code (like async/await functions). So if an error occurs in an async controller and you don’t catch it and pass it to next(err), Express will never know about it, and your app might crash silently that a reason we have to create higher order function in these case we have asynchandle function which is present in this file

constant.js: is used to store name which is use in multiple file so if there is any change we have to change in every file. that a reason we create a variable and store value. like database name. 

config.js -> here we import all env variable and export for similication
app.js--> here we have to configure all the packages and routes present in rotues directory

index.js-> here we connect db as website load beause it is root file for us 
