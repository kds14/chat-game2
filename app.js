var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var gameRouter = require("./routes/game");

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/game", gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next)
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

io.on("connection", function(socket)
{
	console.log("CONNECTED");

	socket.on("disconnect", function()
	{
		console.log("DISCONNECTED");
	});

	socket.on("test", function(msg)
	{
		console.log("TEST MESSAGE RECEIVED FROM CLIENT");
		console.log(msg);
	});

	socket.emit("test-server", "THIS IS A TEST MESSAGE FROM SERVER");
});

http.listen(3000, () => console.log("Listening on port 3000"))

module.exports = app;
