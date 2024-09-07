import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import cors from "cors";

const app = express();
env.config();

const port = process.env.PORT || 4000;
const saltRounds = 10;
const clientURL = "http://localhost:3000";
const localProfilePic = "../../assets/profile.jpg";
let currUser = null;

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
});

db.connect()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection failed: ", err));

app.get("/user", (req, res) => {
    if (req.user || currUser) {
        res.json({
            success: true,
            user: req.user || currUser,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/notes/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "SELECT notes.id, notes.title, notes.content FROM notes JOIN users ON users.id = notes.user_id WHERE notes.user_id = $1 ORDER BY id ASC",
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error querying DB for getting user's notes: ", err);
    }
});

app.get("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getNote = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
        res.json(getNote.rows[0]);
    } catch (err) {
        console.error("Error getting note: ", err);
    }
});

app.put("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updateNotes = await db.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3",
            [title, content, id]
        );
        res.json("successfully updated note");
    } catch (err) {
        console.error("Error putting note: ", err);
    }
});

app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteNotes = await db.query("DELETE FROM notes WHERE id = $1", [id]);
        res.json("successfully deleted note");
    } catch (err) {
        console.error("Error deleting note: ", err);
    }
});

app.post("/notes/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { noteTitle, noteContent } = req.body;
        const addNote = await db.query("INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3)",
            [noteTitle, noteContent, id]
        );
        res.json("successfully added a note for a user");
    } catch (err) {
        console.error("Error posting note for a user: ", err);
    }
});

app.post("/register", async (req, res) => {
    const { fullname, username, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
        if (result.rows.length > 0) {
            res.redirect(clientURL + "/login");
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password: ", err);
                } else {
                    const userResult = await db.query(
                        "INSERT INTO users (fullname, email, password, photo) VALUES ($1, $2, $3, $4) RETURNING *",
                    [fullname, username, hash, localProfilePic]);
                    const user = userResult.rows[0];
                    req.login(user, (err) => {
                        if (err) {
                            console.error("Error logging in user after registration: ", err);
                        } else {
                            console.log("Success logging in user after registration.");
                            currUser = user;
                            res.redirect(clientURL);
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
});

app.get("/login/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get("/login/google/callback",
    passport.authenticate("google", {
        successRedirect: clientURL,
        failureRedirect: clientURL + "/login",
    })
);

app.get("/logout", (req, res) => {
    req.logout( (err) => {
        if (err) console.error(err);
        currUser = null;
        res.redirect(clientURL);
    });
});

app.post("/login/local",
    passport.authenticate("local", {
        successRedirect: clientURL,
        failureRedirect: clientURL + "/login",
    })
);

passport.use(
    "local",
    new Strategy(async function verify(username, password, cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const dbHashedPwd = user.password;
                bcrypt.compare(password, dbHashedPwd, (err, valid) => {
                    if (err) {
                        console.error("Error comparing passwords: ", err);
                        return cb(err);
                    } else {
                        if (valid) {
                            currUser = result.rows[0];
                            return cb(null, user);
                        } else {
                            return cb(null, false);
                        }
                    }
                });
            } else {
                return cb(null, false, {message: "User not found"});
            }
        } catch(err) {
            console.error(err);
            return cb(err);
        }
    })
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/login/google/callback",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const result = await db.query("SELECT * FROM users WHERE email = $1",
                    [profile.email]
                );
                if (result.rows.length === 0) {
                    const newUser = await db.query(
                        "INSERT INTO users (fullname, email, password, photo) VALUES ($1, $2, $3, $4) RETURNING *", 
                        [profile.displayName, profile.email, "google", profile.photos[0].value]
                    );
                    currUser = newUser.rows[0];
                    return cb(null, newUser.rows[0]);
                } else {
                    currUser = result.rows[0];
                    return cb(null, result.rows[0]);
                }
            } catch (err) {
                console.error("Error with google auth: ", err);
                return cb(err);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log("server has started on port ", port);
});