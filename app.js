if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// Required dependencies
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { title } = require('process');


// View engine setup
app.engine("ejs", ejsMate); // Setup EJS with ejs-mate
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data (form submissions)
app.use(methodOverride('_method')); // For supporting HTTP verbs such as DELETE and PUT in forms
app.use(express.static(path.join(__dirname, '/public'))); // Serve static files (like images, css)


// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust1";
const dbUrl = process.env.ATLASDB_URL;
// Database connection setup
main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}



// // Add this to see all registered routes
// console.log("Registered routes:");
// app._router.stack.forEach(function(r){
//   if (r.route && r.route.path){
//     console.log(r.route.path);b
//   } else if (r.name === 'router') {
//     r.handle.stack.forEach(function(route){
//       route = route.route;
//       if(route) {
//         console.log("  " + route.path);
//       }
//     });
//   }
// });
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MOMGO SESSION STORE",err);
})

const sessionOptions = {
    store,
   secret: process.env.SECRET,           // Secret key for signing session cookies
   resave: false,                         // Don't save session if unmodified
   saveUninitialized: true,              // Save new sessions even if empty
   cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000,                // Session expires in 7 days (milliseconds)
       httpOnly: true,                                   // Prevent client-side JS access to cookie
   },
};



// Root route
// app.get("/", (req, res) => {
//     res.send("hi i am root"); // Simple root response
// });


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
    
// })

//  Demo Register
//  app.get("/demouser", async(req, res) => {
//      let fuser = new User ({
//          email: "raj@gmail.ocm",
//          username: "raajj.0x,"
//      });
//      let regUser = await User.register(fuser, "helloworld");
//      res.send(regUser);
//  });



// fdkfkdkfdfdjkj

// Routes setup
app.use("/", listingRouter); // All routes starting with "/listings" will use listings.js router
app.use("/listings/:id/reviews", reviewRouter); // Routes for handling reviews
app.use("/",userRouter);






// Handle undefined routes (404 error page)
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found")); // Handle all unrecognized routes
// });

// Global error handling middleware
app.use((err, req, res, next) => {
    let { status = 400, message = "something went wrong" } = err;
    res.render("error.ejs", { message }); // Render error page with message
});


// Server listening on port 8080
app.listen(8080, () => {
    console.log("listening port no 8080");
});
